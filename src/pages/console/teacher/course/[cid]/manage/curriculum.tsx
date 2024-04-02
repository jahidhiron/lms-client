import { Box, Button, Group, Stack, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { nanoid } from 'nanoid';
import SortableList from '~/components/core/SortableList';
import SortableItem from '~/components/core/SortableList/components/SortableItem';
import CourseEditPageHeader from '~/components/headers/CourseEditPageHeader';
import SectionContainer from '~/components/pages/course/curriculum/section/SectionContainer';
import { SectionModel } from '~/features/course/course.model';
import { autoUpdateTrigger } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import { useCourseFormContext } from '~/libs/providers/CourseFormProvider';

const CurriculumPage = () => {
  const { t: commonT } = useTranslation('common');
  const { t: curriculumT } = useTranslation('curriculum');
  const form = useCourseFormContext();

  const onItemPress = () => {
    form.insertListItem(`sections`, {
      rowId: nanoid(),
      title: '',
      desc: '',
      items: [],
    } as SectionModel);
  };

  return (
    <Box px="xl">
      <CourseEditPageHeader
        title={commonT('common.course-navigation.curriculum')}
      />
      <Text my="sm">{curriculumT('curriculum-message')}</Text>

      <Stack>
        <SortableList
          items={form.values.sections}
          renderItem={(item, index, getId) => {
            return (
              <SortableItem id={getId?.(item)!}>
                <SectionContainer
                  sectionId={item._id || item.rowId}
                  index={index!}
                />
              </SortableItem>
            );
          }}
          getItemId={(item) => item.rowId || item._id || ''}
          onChange={(items) => {
            form.setFieldValue('sections', items);

            autoUpdateTrigger(form);
          }}
        />
        <Group>
          <Button
            size="xs"
            leftSection={<IconPlus size="15" />}
            onClick={onItemPress}
          >
            Add Section
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

export default CurriculumPage;
