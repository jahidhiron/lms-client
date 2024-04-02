import { Box, Center, Overlay } from '@mantine/core';
import { IconNotes, IconPlayerSkipForward } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import VideoPlayer from '~/components/core/VideoPlayer';
import RingInterval from '~/components/utils/RingInterval';
import { useEnrollmentMutations } from '~/features/enrollment/use-enrollment';
import { useNotes } from '~/features/note/use-note';
import { getStaticContentUrl } from '~/helpers/utils';
import useCurrentNextSectionItem from '~/hooks/use-current-sectionItem';
import useVideoPlayerState from '~/libs/store/useVideoPlayerState';

export type LectureNoteView = 'idle' | 'button';

type LectureViewProps = {
  setNoteViewState: Dispatch<SetStateAction<LectureNoteView>>;
};

export default function LectureView({ setNoteViewState }: LectureViewProps) {
  const router = useRouter();

  const { eId, itemId: lectureId } = router.query;
  const setIsPlaying = useVideoPlayerState((state) => state.setIsPlaying);
  const setContainerHovered = useVideoPlayerState(
    (state) => state.setContainerHovered
  );
  const isAutoPlay = useVideoPlayerState((state) => state.isAutoPlay);
  const [upNextView, setUpNextView] = useState<boolean>(false);
  const { nextItem, currentItem, moveToNextItem } = useCurrentNextSectionItem({
    itemId: lectureId as string,
    eId: eId as string,
  });
  const { notes } = useNotes({
    page: 1,
    size: 9999,
    lectureId: lectureId as string,
  });
  const { completeLecture } = useEnrollmentMutations();

  const notesMarker = useMemo(() => {
    return notes?.map((note) => ({
      markInSecond: note.noteInSecond,
      title: note.title,
    }));
  }, [notes]);

  return (
    <Box>
      {upNextView && nextItem && (
        <Overlay>
          <Center w="100%" h="100%">
            <RingInterval
              countdownFrom={10}
              onDone={() => {
                moveToNextItem();
                setUpNextView(false);
              }}
              onCancel={() => {
                setUpNextView(false);
              }}
              label={
                nextItem?.lecture?.title ||
                nextItem?.quiz?.title ||
                nextItem?.assignment?.title ||
                ''
              }
            />
          </Center>
        </Overlay>
      )}
      <VideoPlayer
        withMarker
        withAutoPlay
        withCaption
        markers={notesMarker}
        addons={{
          'left-end': [
            {
              Icon: IconNotes,
              label: 'Create Note',
              onClick(_currentTime) {
                if (!router.asPath.endsWith('/notes')) {
                  router.push({
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      tabId: 'notes',
                    },
                  });
                }
                setNoteViewState('button');
                setIsPlaying(false);
              },
            },
            {
              Icon: IconPlayerSkipForward,
              label: 'Skip Lesson',
              onClick(_currentTime) {
                moveToNextItem();
                completeLecture(eId as string, lectureId as string).catch(
                  (err) => console.log(err)
                );
              },
            },
          ],
        }}
        captions={[
          {
            lang: 'English',
            url: '/v.vtt',
          },
          {
            lang: 'Japanese',
            url: '/e.vtt',
          },
        ]}
        videoSource={getStaticContentUrl(
          currentItem?.lecture?.video?.path || ''
        )}
        reloadId={lectureId as string}
        onVideoEnd={() => {
          if (isAutoPlay) {
            setContainerHovered(false);
            setUpNextView(true);
          }
          completeLecture(eId as string, lectureId as string).catch((err) =>
            console.log(err)
          );
        }}
        idleDelay={3000}
      />
    </Box>
  );
}
