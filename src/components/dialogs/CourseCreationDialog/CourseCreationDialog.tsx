import {
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Stepper,
  Text,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Logo from '~/components/core/Logo';
import { AddCourseModel } from '~/features/course/course.model';
import { addUpdateCourseSchema } from '~/features/course/course.validator';
import { useCourseMutations } from '~/features/course/use-course';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import SelectCourseCategories from './steps/SelectCourseCategories';
import SelectCourseType from './steps/SelectCourseType';
import TypeCourseTitle from './steps/TypeCourseTitle';

type CourseCreationDialogProps = {};

const MAX_STEP = 3;

export default function CourseCreationDialog({}: CourseCreationDialogProps) {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const { addNewCourse } = useCourseMutations();
  const form = useForm<AddCourseModel>({
    validate: addUpdateCourseSchema,
  });

  const nextStep = () => {
    if (active == 1 && (!form.isValid('title') || !form.isValid('subTitle'))) {
      form.validateField('title');
      form.validateField('subTitle');
      return;
    }
    if (
      active == 2 &&
      (!form.isValid('categoryId') || !form.isValid('subCategoryId'))
    ) {
      form.validateField('categoryId');
      form.validateField('subCategoryId');
      return;
    }
    setActive((current) => (current < MAX_STEP ? current + 1 : current));
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const { t: commonT } = useTranslation('common');
  return (
    <form
      onSubmit={form.onSubmit((values) => {
        toast.promise(addNewCourse(values), {
          success: (data) => {
            router.replace(
              `/console/teacher/course/${data.data.course._id}/manage/goals`
            );
            return data.message;
          },
          error: errorResolver(form),
          loading: commonT('common.loading.create', {
            feature: commonT('common.words.course'),
          }),
        });
      })}
    >
      <Paper>
        <Group w="100%" p="xs" justify="space-between">
          <Logo />
          <Button onClick={() => modals.closeAll()} variant="light">
            {commonT('common.words.exit')}
          </Button>
        </Group>
      </Paper>

      <Box p="xl">
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step>
            <SelectCourseType />
          </Stepper.Step>
          <Stepper.Step>
            <TypeCourseTitle form={form} />
          </Stepper.Step>
          <Stepper.Step>
            <SelectCourseCategories form={form} />
          </Stepper.Step>
          <Stepper.Completed>
            <Stack align="center" gap="xl" py="xl">
              <Title>
                {commonT('common.steps.course-creation.step-4.title')}
              </Title>
              <Text size="sm">
                {commonT('common.steps.course-creation.step-4.subtitle')}
              </Text>
              <Button type="submit" onClick={() => {}}>
                {commonT('common.labels.create', {
                  feature: commonT('common.words.course'),
                })}
              </Button>
            </Stack>
          </Stepper.Completed>
        </Stepper>

        <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep} disabled={active == 0}>
            Back
          </Button>
          <Button onClick={nextStep} disabled={active == MAX_STEP}>
            Next
          </Button>
        </Group>
      </Box>
    </form>
  );
}
