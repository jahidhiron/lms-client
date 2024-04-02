import { Box, Button } from '@mantine/core';
import { IconMessage2 } from '@tabler/icons-react';
import { ReactNode, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { LectureModel } from '~/features/lecture/lecture.model';
import { useLectureMutations } from '~/features/lecture/use-lecture';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import LectureDescriptionForm from '../LectureDescriptionForm';
import LectureDescriptionPreview from '../LectureDescriptionPreview';

type AddDescriptionSectionProps = {
  lecture?: LectureModel;
};

type ViewStateType = 'idle' | 'preview' | 'form';

export default function AddDescriptionSection({
  lecture,
}: AddDescriptionSectionProps) {
  const [viewState, setViewState] = useState<ViewStateType>(
    (lecture?.desc?.replace('<p></p>', '')?.length as number) > 0
      ? 'preview'
      : 'idle'
  );
  const { updateLecture } = useLectureMutations();
  const { t: commonT } = useTranslation('common');

  const renderView = useMemo(
    () =>
      ({
        idle: (
          <Button
            leftSection={<IconMessage2 size="20" />}
            color="blue"
            size="xs"
            variant="outline"
            onClick={() => {
              setViewState('form');
            }}
          >
            Add Description
          </Button>
        ),
        preview: (
          <LectureDescriptionPreview
            desc={lecture?.desc}
            onEdit={() => {
              setViewState('form');
            }}
          />
        ),
        form: (
          <Box w="100%">
            <LectureDescriptionForm
              desc={lecture?.desc || ''}
              onSave={(desc) => {
                toast.promise(
                  updateLecture(lecture?._id!, {
                    desc: desc!,
                    preview: lecture?.preview || false,
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
                    loading: commonT('common.loading.create', {
                      feature: commonT('common.words.lecture'),
                    }),
                  }
                );
              }}
              onCancel={() => {
                if ((lecture?.desc?.length as number) > 0) {
                  setViewState('preview');
                  return;
                }
                setViewState('idle');
              }}
            />
          </Box>
        ),
      }) as Record<ViewStateType, ReactNode>,
    [lecture]
  );

  return <>{renderView[viewState]}</>;
}
