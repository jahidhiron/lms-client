import { Box, Stack } from '@mantine/core';
import ListInput from '~/components/core/ListInput';
import CourseEditPageHeader from '~/components/headers/CourseEditPageHeader';
import useTranslation from '~/hooks/use-translation';
import { useCourseFormContext } from '~/libs/providers/CourseFormProvider';

const CourseGoalsPage = () => {
  const { t: commonT } = useTranslation('common');
  const { t: intendedT } = useTranslation('intended-learners');
  const form = useCourseFormContext();

  return (
    <Box px="xl">
      <CourseEditPageHeader
        title={commonT('common.course-navigation.intended-learners')}
      />
      <Stack py="md" gap="xl">
        <ListInput
          title={intendedT('what-will-learn-title')}
          subTitle={intendedT('what-will-learn-message')}
          values={form.values.whatWillLearn || []}
          onAddNew={(newItem) => {
            form.setFieldValue('whatWillLearn', [
              ...form.values.whatWillLearn,
              newItem,
            ]);
          }}
          onRemove={(item) => {
            form.setFieldValue(
              'whatWillLearn',
              form.values.whatWillLearn?.filter((wwl) => wwl.id !== item.id)
            );
          }}
          onReorder={(items) => {
            form.setFieldValue('whatWillLearn', items);
          }}
          onInputChange={(index, value) => {
            form.setFieldValue(`whatWillLearn.${index}.value`, value);
          }}
        />
        <ListInput
          title={intendedT('prerequisites-title')}
          subTitle={intendedT('prerequisites-message')}
          values={form.values.prerequisites || []}
          onAddNew={(newItem) => {
            form.setFieldValue('prerequisites', [
              ...form.values.prerequisites,
              newItem,
            ]);
          }}
          onRemove={(item) => {
            form.setFieldValue(
              'prerequisites',
              form.values.prerequisites?.filter((wwl) => wwl.id !== item.id)
            );
          }}
          onReorder={(items) => {
            form.setFieldValue('prerequisites', items);
          }}
          onInputChange={(index, value) => {
            form.setFieldValue(`prerequisites.${index}.value`, value);
          }}
        />
        <ListInput
          title={intendedT('who-is-this-course-title')}
          subTitle={intendedT('who-is-this-course-message')}
          values={form.values.whoIsThisCourseFor || []}
          onAddNew={(newItem) => {
            form.setFieldValue('whoIsThisCourseFor', [
              ...form.values.whoIsThisCourseFor,
              newItem,
            ]);
          }}
          onRemove={(item) => {
            form.setFieldValue(
              'whoIsThisCourseFor',
              form.values.whoIsThisCourseFor?.filter(
                (wwl) => wwl.id !== item.id
              )
            );
          }}
          onReorder={(items) => {
            form.setFieldValue('whoIsThisCourseFor', items);
          }}
          onInputChange={(index, value) => {
            form.setFieldValue(`whoIsThisCourseFor.${index}.value`, value);
          }}
        />
      </Stack>
    </Box>
  );
};

export default CourseGoalsPage;
