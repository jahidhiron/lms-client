import { Box, Stack, Text, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import TextInput from '~/components/core/TextInput';
import { AddCourseModel } from '~/features/course/course.model';
import { TITLE_MAX_CHAR } from '~/helpers/constants';
import useTranslation from '~/hooks/use-translation';

const TypeCourseTitle = ({
  form,
}: {
  form: UseFormReturnType<AddCourseModel>;
}) => {
  const { t: commonT } = useTranslation('common');

  return (
    <Stack align="center" justify="center" p="lg">
      <Title>{commonT('common.steps.course-creation.step-2.title')}</Title>
      <Text size="sm">
        {commonT('common.steps.course-creation.step-2.subtitle')}
      </Text>
      <Stack mt="md" align="center">
        <Box>
          <TextInput
            maxLength={TITLE_MAX_CHAR}
            w="450"
            size="md"
            rightSection={<Text c="dimmed">40</Text>}
            placeholder="Course Title"
            {...form.getInputProps('title')}
          />
        </Box>
        <TextInput
          withAria
          maxLength={TITLE_MAX_CHAR}
          w="300"
          size="md"
          rightSection={<Text c="dimmed">40</Text>}
          placeholder="Course Sub-Title"
          {...form.getInputProps('subTitle')}
        />
        <Text size="xs">Sub-Title</Text>
      </Stack>
    </Stack>
  );
};

export default TypeCourseTitle;
