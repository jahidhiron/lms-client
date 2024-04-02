import {
  Box,
  Button,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CourseEditPageHeader from '~/components/headers/CourseEditPageHeader';
import { useCourseMutations } from '~/features/course/use-course';
import { currencies } from '~/helpers/currencies';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import { useCourseFormContext } from '~/libs/providers/CourseFormProvider';

const PricingPage = () => {
  const router = useRouter();
  const courseId = router?.query?.cid as string;
  const [coursePricing, setCoursePricing] = useState('free');
  const form = useCourseFormContext();
  const [amount, setAmount] = useState<number>();
  const [currency, setCurrency] = useState<string>();
  const { t: commonT } = useTranslation('common');

  const { updateCourse } = useCourseMutations();
  useEffect(() => {
    if (amount !== form.values.price.amount) {
      setAmount(form.values.price.amount);
    }
    if (currency !== form.values.price.currency) {
      setCurrency(form.values.price.currency);
    }
  }, [form.values.price]);

  return (
    <Box px="xl">
      <CourseEditPageHeader title="Pricing" />
      <Stack py="md" align="flex-start">
        <Box>
          <Title order={6}>Set a Price for your course</Title>
          <Text>
            Please select the currency and the price tier for your course. If
            you’d like to offer your course for free, it must have a total video
            length of less than 2 hours. Also, courses with practice tests can
            not be free.
          </Text>
        </Box>
        <Select
          data={[
            { label: 'Free', value: 'free' },
            { label: 'Paid', value: 'paid' },
          ]}
          label="Pricing"
          value={coursePricing}
          clearable={false}
          onChange={(value) => {
            if (value == 'free') {
              // @ts-ignore
              form.setFieldValue('price', {});
            }
            setCoursePricing(value!);
          }}
        />
        {coursePricing === 'paid' && (
          <Group>
            <Select
              allowDeselect={false}
              searchable
              clearable
              data={currencies}
              label="Currency"
              value={currency}
              // @ts-ignore
              onChange={setCurrency}
            />
            <TextInput
              label="Price"
              value={amount}
              type="number"
              onChange={(ev) => {
                setAmount(ev.target.valueAsNumber);
              }}
            />
          </Group>
        )}
        <Button
          size="xs"
          disabled={
            coursePricing === 'paid'
              ? JSON.stringify(form.values.price) ===
                  JSON.stringify({ currency, amount }) ||
                !amount ||
                !currency
              : false
          }
          //   @ts-ignore
          onClick={() => {
            toast.promise(
              updateCourse(courseId, {
                ...form.values,
                price: { amount: amount!, currency: currency! },
              }),
              {
                success: (data) => {
                  form.setFieldValue('price', {
                    currency: currency!,
                    amount: amount!,
                  });
                  return data.message;
                },
                error: errorResolver(form),
                loading: commonT('common.loading.update', {
                  feature: commonT('common.words.course'),
                }),
              }
            );
          }}
        >
          Save
        </Button>
      </Stack>
    </Box>
  );
};

export default PricingPage;
