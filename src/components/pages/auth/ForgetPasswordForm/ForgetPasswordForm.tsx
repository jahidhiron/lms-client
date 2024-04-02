import { Anchor, Box, Button, Flex, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowLeft, IconCubeSend } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import TextInput from '~/components/core/TextInput';
import AuthPageHeader from '~/components/headers/AuthPageHeader';
import { ForgotPasswordOTPSendReqBody } from '~/features/auth/auth.model';
import { forgotPasswordSendOTPSchema } from '~/features/auth/auth.validator';
import { useAuthMutations } from '~/features/auth/use-auth';
import { TIMER_MIN_KEY, TIMER_SEC_KEY } from '~/helpers/constants';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import classes from './ForgetPasswordForm.module.css';

interface ForgotPasswordFormProps {}

const ForgotPasswordForm: FC<ForgotPasswordFormProps> = () => {
  const router = useRouter();
  const [loading, { close: closeLoading, open: startLoading }] =
    useDisclosure(false);
  const { t: authT } = useTranslation('auth');
  const { t: commonT } = useTranslation('common');
  const { forgotPasswordSendOTP } = useAuthMutations();
  const form = useForm<ForgotPasswordOTPSendReqBody>({
    validate: forgotPasswordSendOTPSchema,
    initialValues: {
      email: '',
    },
  });

  return (
    <Box w="100%">
      <AuthPageHeader title={authT('auth.forgot-password') + ' ?'} />

      <form
        onSubmit={form.onSubmit((values) => {
          startLoading();
          toast.promise(forgotPasswordSendOTP(values), {
            loading: commonT('common.loading.send'),
            success(data) {
              closeLoading();
              sessionStorage.removeItem(TIMER_MIN_KEY);
              sessionStorage.removeItem(TIMER_SEC_KEY);
              router.push({
                pathname: '/auth/verify-otp',
                query: {
                  email: values.email,
                  type: 'forgot-password',
                },
              });
              return data?.message;
            },
            error(error) {
              closeLoading();
              return errorResolver()(error);
            },
          });
        })}
      >
        <TextInput
          withAsterisk
          label={commonT('common.words.email')}
          placeholder="example@mail.com"
          {...form.getInputProps('email')}
        />

        <Group mt="lg" justify="space-between" className={classes.controls}>
          <Anchor c="dimmed" size="sm" component={Link} href="/auth/login">
            <Flex>
              <IconArrowLeft stroke={1.5} />
              <Box ml={5}>{authT('auth.labels.back-to-login')}</Box>
            </Flex>
          </Anchor>
          <Button
            type="submit"
            loading={loading}
            className={classes.control}
            rightSection={<IconCubeSend />}
          >
            {authT('auth.send-otp')}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default ForgotPasswordForm;
