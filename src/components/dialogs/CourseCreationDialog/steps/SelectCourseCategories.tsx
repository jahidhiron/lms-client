import { Group, Stack, Text, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { AddCourseModel } from '~/features/course/course.model';
import useSelectCategories from '~/hooks/use-select-categories';
import useSelectSubCategories from '~/hooks/use-select-subcategories';
import useTranslation from '~/hooks/use-translation';

const SelectCourseCategories = ({
  form,
}: {
  form: UseFormReturnType<AddCourseModel>;
}) => {
  const { t: commonT } = useTranslation('common');
  const { SelectCategories } = useSelectCategories();
  const { SelectSubCategories } = useSelectSubCategories({
    categoryId: form.values.categoryId,
  });

  return (
    <Stack align="center" justify="center" p="lg">
      <Title>{commonT('common.steps.course-creation.step-3.title')}</Title>
      <Text size="sm">
        {commonT('common.steps.course-creation.step-3.subtitle')}
      </Text>
      <Group mt="md">
        <SelectCategories
          w="400"
          size="md"
          label={undefined}
          placeholder="Choose Category"
          {...form.getInputProps('categoryId')}
          onChange={(ev) => {
            form.getInputProps('categoryId').onChange(ev);
            form.setFieldValue('subCategoryId', '');
          }}
        />
        <SelectSubCategories
          w="400"
          label={undefined}
          size="md"
          placeholder="Choose Sub Category"
          {...form.getInputProps('subCategoryId')}
        />
      </Group>
    </Stack>
  );
};

export default SelectCourseCategories;
