import { Box, Button, CloseButton, Group } from '@mantine/core';
import { IconVideoPlus } from '@tabler/icons-react';
import { ReactNode, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import FileUploader from '~/components/core/FileUploader';
import { LectureModel } from '~/features/lecture/lecture.model';
import { useLectureMutations } from '~/features/lecture/use-lecture';
import { FILE_TYPE_VIDEO } from '~/helpers/constants';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import LectureVideoPreview from '../LectureVideoPreview';

type AddVideoSectionProps = {
  lecture?: LectureModel;
};

type ViewStateType = 'idle' | 'preview' | 'upload';

export default function AddVideoSection({ lecture }: AddVideoSectionProps) {
  const [viewState, setViewState] = useState<ViewStateType>(
    lecture?.videoId ? 'preview' : 'idle'
  );
  const { updateLecture } = useLectureMutations();
  const { t: commonT } = useTranslation('common');

  const renderView = useMemo(
    () =>
      ({
        idle: (
          <Button
            leftSection={<IconVideoPlus size="20" />}
            color="blue"
            size="xs"
            variant="outline"
            onClick={() => {
              setViewState('upload');
            }}
          >
            Add Video
          </Button>
        ),
        preview: (
          <LectureVideoPreview
            video={lecture?.video}
            onEdit={() => setViewState('upload')}
            previewState={lecture?.preview}
            onPreviewChange={(checked) => {
              toast.promise(
                updateLecture(lecture?._id!, {
                  desc: lecture?.desc!,
                  preview: checked,
                  resources: lecture?.resources || [],
                  title: lecture?.title,
                  videoId: lecture?.videoId as string,
                }),
                {
                  success: (data) => {
                    setViewState('preview');
                    return data.message;
                  },
                  error: errorResolver(),
                  loading: commonT('common.loading.update', {
                    feature: commonT('common.words.lecture'),
                  }),
                }
              );
            }}
          />
        ),
        upload: (
          <Box w="100%">
            <Group w="100%" mb={0} justify="flex-end">
              <CloseButton
                onClick={() => {
                  if (lecture?.videoId) {
                    setViewState('preview');
                    return;
                  }
                  setViewState('idle');
                }}
              />
            </Group>
            <FileUploader
              fileType={FILE_TYPE_VIDEO}
              multiple={false}
              onDone={(file) => {
                toast.promise(
                  updateLecture(lecture?._id!, {
                    desc: lecture?.desc!,
                    preview: lecture?.preview || false,
                    resources: lecture?.resources || [],
                    title: lecture?.title,
                    videoId: file?.[0]?._id,
                  }),
                  {
                    success: (data) => {
                      setViewState('preview');
                      return data.message;
                    },
                    error: errorResolver(),
                    loading: commonT('common.loading.update', {
                      feature: commonT('common.words.lecture'),
                    }),
                  }
                );
              }}
            />
          </Box>
        ),
      }) as Record<ViewStateType, ReactNode>,
    [lecture, lecture?.videoId]
  );

  return <>{renderView[viewState]}</>;
}
