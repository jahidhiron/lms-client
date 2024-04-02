import { Paper, Stack, Text, rem } from '@mantine/core';
import { modals } from '@mantine/modals';
import { nanoid } from 'nanoid';
import { useMemo, useState } from 'react';
import SortableList from '~/components/core/SortableList';
import SortableItem from '~/components/core/SortableList/components/SortableItem';
import { SectionItemModel } from '~/features/course/course.model';
import {
  SECTION_ITEM_ASSIGNMENT,
  SECTION_ITEM_LECTURE,
  SECTION_ITEM_QUIZ,
} from '~/helpers/constants';
import { autoUpdateTrigger } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import { useCourseFormContext } from '~/libs/providers/CourseFormProvider';
import AddSectionItemButton from '../../AddSectionItemButton';
import AssignmentContainer from '../../assignment/AssignmentContainer';
import LectureContainer from '../../lecture/LectureContainer';
import QuizContainer from '../../quiz/QuizContainer';
import SectionForm from '../SectionForm';
import SectionFormPreview from '../SectionFormPreview';
import classes from './SectionContainer.module.css';

type SectionContainerProps = {
  index: number;
  sectionId?: string;
};

export default function SectionContainer({ index }: SectionContainerProps) {
  const [preview, setPreview] = useState(true);
  const { t: commonT } = useTranslation('common');
  const form = useCourseFormContext();
  const section = useMemo(
    () => form.values.sections?.at(index),
    [index, form.values.sections]
  );
  const isEnableItemAdding = useMemo(
    () =>
      (section?.items?.filter(
        (item) => !(item?.lectureId || item?.quizId || item?.assignmentId)
      )?.length as number) <= 0,
    [section, form]
  );

  const renderSectionItems = useMemo(() => {
    return (
      <SortableList
        items={(section?.items || []) as SectionItemModel[]}
        getItemId={(item) =>
          // @ts-ignore
          item?.rowId ||
          item?.lectureId! ||
          item?.quizId! ||
          item?.assignmentId!
        }
        onChange={(items) => {
          form.setFieldValue(`sections.${index}.items`, items);
          autoUpdateTrigger(form);
        }}
        renderItem={(item, itemIndex, getId) => {
          if (item?.lectureId || item?.itemType === SECTION_ITEM_LECTURE) {
            return (
              <SortableItem id={getId?.(item)!} key={getId?.(item)!}>
                <LectureContainer
                  key={getId?.(item)}
                  lectureIndex={itemIndex!}
                  sectionIndex={index}
                  lectureId={item.lectureId as string}
                  lecture={item?.lecture}
                />
              </SortableItem>
            );
          } else if (item?.quizId || item?.itemType === SECTION_ITEM_QUIZ) {
            return (
              <SortableItem key={getId?.(item)!} id={getId?.(item)!}>
                <QuizContainer
                  key={getId?.(item)}
                  quizIndex={itemIndex!}
                  sectionIndex={index}
                  quizId={item.quizId as string}
                  quiz={item?.quiz}
                />
              </SortableItem>
            );
          } else if (
            item?.assignmentId ||
            item?.itemType === SECTION_ITEM_ASSIGNMENT
          ) {
            return (
              <SortableItem key={getId?.(item)!} id={getId?.(item)!}>
                <AssignmentContainer
                  key={getId?.(item)}
                  assignmentIndex={itemIndex!}
                  sectionIndex={index}
                  assignmentId={item.assignmentId! as string}
                  assignment={item?.assignment}
                />
              </SortableItem>
            );
          }
        }}
      />
    );
  }, [section, form]);

  const onItemPress = (itemType: number) => {
    form.setFieldValue(`sections.${index}.items`, [
      ...(section?.items || []),
      { rowId: nanoid(), itemType } as SectionItemModel,
    ]);
  };

  return (
    <Paper className={classes.container} p="lg" withBorder>
      {preview ? (
        <SectionFormPreview
          index={index}
          title={section?.title || ''}
          onEdit={() => {
            setPreview(false);
          }}
          onRemove={() => {
            modals.openConfirmModal({
              title: commonT('common.labels.remove', {
                feature: commonT('common.words.section'),
                title: section?.title,
              }),
              centered: true,
              children: (
                <Text size="sm">
                  {commonT('common.labels.remove-message', {
                    feature: commonT('common.words.section'),
                    title: section?.title,
                  })}
                </Text>
              ),
              labels: {
                confirm: commonT('common.words.confirm'),
                cancel: commonT('common.words.cancel'),
              },
              confirmProps: { color: 'red' },
              onConfirm: () => {
                form.setFieldValue(
                  `sections`,
                  form.values.sections?.filter((_, i) => index != i)
                );
                autoUpdateTrigger(form);
              },
            });
          }}
        />
      ) : (
        <SectionForm
          index={index}
          onCancel={() => {
            setPreview(true);
          }}
          title={section?.title || ''}
          desc={section?.desc || ''}
          onSave={(title, desc) => {
            form.setFieldValue(`sections.${index}.title`, title);
            form.setFieldValue(`sections.${index}.desc`, desc);
            setPreview(true);
            autoUpdateTrigger(form);
          }}
        />
      )}

      <Stack pl={rem(80)} mt="xs" align="flex-start">
        {renderSectionItems}
        <AddSectionItemButton
          onPress={onItemPress}
          disabled={!isEnableItemAdding}
        />
      </Stack>
    </Paper>
  );
}
