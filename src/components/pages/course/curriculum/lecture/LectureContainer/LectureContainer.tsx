import { Box, Divider, Group, Paper, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { LectureModel } from '~/features/lecture/lecture.model';
import {
  useLecture,
  useLectureMutations,
} from '~/features/lecture/use-lecture';
import { autoUpdateTrigger, errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import { useCourseFormContext } from '~/libs/providers/CourseFormProvider';
import SectionItemPreview from '../../SectionItemPreview';
import AddDescriptionSection from '../AddDescriptionSection';
import AddResourcesSection from '../AddResourcesSection';
import AddVideoSection from '../AddVideoSection';
import LectureForm from '../LectureForm';
import classes from './LectureContainer.module.css';

type LectureContainerProps = {
  sectionIndex: number;
  lectureIndex: number;
  lectureId?: string;
  lecture?: LectureModel;
};

export type LectureViews = 'description' | 'resources' | 'content';

export default function LectureContainer({
  sectionIndex,
  lectureIndex,
  lectureId,
}: LectureContainerProps) {
  const { t: commonT } = useTranslation('common');
  const [preview, setPreview] = useState(!!lectureId);
  const [collapsed, setCollapsed] = useState(false);
  const { addNewLecture, updateLecture, deleteLecture } = useLectureMutations();
  const { lecture } = useLecture({ id: lectureId! });
  const form = useCourseFormContext();

  return (
    <Paper withBorder bg="white" w="100%" p="md" className={classes.container}>
      {preview ? (
        <SectionItemPreview
          sectionName="Lecture"
          collapsedState={collapsed}
          onToggleCollapsed={() => setCollapsed(!collapsed)}
          itemIndex={lectureIndex}
          onEdit={() => {
            setCollapsed(false);
            setPreview(false);
          }}
          onRemove={() => {
            modals.openConfirmModal({
              title: commonT('common.labels.remove', {
                feature: commonT('common.words.lecture'),
                title: lecture?.title,
              }),
              centered: true,
              children: (
                <Text size="sm">
                  {commonT('common.labels.remove-message', {
                    feature: commonT('common.words.lecture'),
                    title: lecture?.title,
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
                  `sections.${sectionIndex}.items`,
                  form.values.sections
                    ?.at(sectionIndex)
                    ?.items?.filter((_, i) => lectureIndex != i)
                );
                toast.promise(deleteLecture(lectureId!), {
                  success: (data) => data.message,
                  error: errorResolver(form),
                  loading: commonT('common.loading.delete', {
                    feature: commonT('common.words.lecture'),
                    title: lecture?.title,
                  }),
                });
                autoUpdateTrigger(form);
              },
            });
          }}
          title={lecture?.title || ''}
        />
      ) : (
        <LectureForm
          title={lecture?.title || ''}
          onSave={(title) => {
            if (lectureId || lecture) {
              toast.promise(
                updateLecture((lectureId || lecture?._id)!, {
                  desc: lecture?.desc!,
                  preview: lecture?.preview || false,
                  resources: lecture?.resources || [],
                  title,
                  videoId: lecture?.videoId as string,
                }),
                {
                  success: (data) => {
                    setPreview(true);
                    return data.message;
                  },
                  error: errorResolver(form),
                  loading: commonT('common.loading.create', {
                    feature: commonT('common.words.lecture'),
                  }),
                }
              );
              return;
            }
            toast.promise(addNewLecture({ title }), {
              success: (data) => {
                form.setFieldValue(
                  `sections.${sectionIndex}.items.${lectureIndex}.lectureId`,
                  data.data?.lecture?._id
                );
                setPreview(true);

                autoUpdateTrigger(form);
                return data.message;
              },
              error: errorResolver(form),
              loading: commonT('common.loading.create', {
                feature: commonT('common.words.lecture'),
              }),
            });
          }}
          onCancel={() => {
            if (!lectureId) {
              form.setFieldValue(
                `sections.${sectionIndex}.items`,
                form.values?.sections
                  ?.at(sectionIndex)
                  ?.items?.filter((_, index) => index != lectureIndex)
              );
            }
            setPreview(true);
          }}
          lectureIndex={lectureIndex}
        />
      )}
      {collapsed && (
        <Box mt="xs">
          <Divider />

          <Group mt="xs">
            <AddVideoSection lecture={lecture} />
            <AddDescriptionSection lecture={lecture} />
            <AddResourcesSection lecture={lecture} />
          </Group>
        </Box>
      )}
    </Paper>
  );
}
