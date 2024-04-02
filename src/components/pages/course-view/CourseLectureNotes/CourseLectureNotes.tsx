import { Button, Container, Group, Select, Stack } from '@mantine/core';
import { IconEditCircle, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import EmptyListContent from '~/components/utils/EmptyListContent';
import { useCourse } from '~/features/course/use-course';
import { useNoteMutations, useNotes } from '~/features/note/use-note';
import { errorResolver, formatTimeFromSeconds } from '~/helpers/utils';
import useVideoPlayerState from '~/libs/store/useVideoPlayerState';
import type { LectureNoteView } from '~/pages/course/[slug]/[eId]/[itemType]/[itemId]/[tabId]';
import CourseNoteItem from '../CourseNoteItem';
import CourseNotesForm from '../CourseNotesForm';
import classes from './CourseLectureNotes.module.css';
type CourseLectureNotesProps = {
  viewState: LectureNoteView;
  setViewState: Dispatch<SetStateAction<LectureNoteView>>;
};

export default function CourseLectureNotes({
  viewState,
  setViewState,
}: CourseLectureNotesProps) {
  const router = useRouter();
  const itemType = router.query?.itemType as string;
  const lectureId = router.query?.itemId as string;
  const courseSlug = router.query?.slug as string;
  const courseId = useCourse({ id: courseSlug, isPublic: true })?.course?._id;
  const currentTime = useVideoPlayerState((state) => state.currentTime);
  const setIsPlaying = useVideoPlayerState((state) => state.setIsPlaying);
  const { addNewNote, updateNote } = useNoteMutations();
  const [notesType, setNotesType] = useState<'all' | 'id'>('id');
  const { notes } = useNotes({
    page: 1,
    size: 9999,
    enable: itemType === 'lecture',
    lectureId: notesType == 'id' ? lectureId : undefined,
    courseId,
  });

  const savedNote = useMemo(
    () =>
      itemType == 'lecture'
        ? notes?.find(
            (note) =>
              lectureId === note.lectureId &&
              Math.round(note.noteInSecond) === Math.round(currentTime)
          )
        : null,
    [currentTime, notes]
  );

  return (
    <Container p="xl">
      <Stack>
        {viewState == 'idle' ? (
          <>
            <Button
              size="md"
              variant="transparent"
              fullWidth
              justify="space-between"
              className={classes.noteInput}
              rightSection={savedNote ? <IconEditCircle /> : <IconPlus />}
              onClick={() => {
                setViewState('button');
                setIsPlaying(false);
              }}
            >
              {savedNote ? 'Edit your note' : 'Create a new'} Note at{' '}
              {formatTimeFromSeconds(currentTime)}s
            </Button>
          </>
        ) : (
          <>
            <CourseNotesForm
              onCancel={() => {
                setViewState('idle');
              }}
              onSave={(time, note) => {
                if (savedNote) {
                  toast.promise(
                    updateNote(savedNote?._id, {
                      noteInSecond: Math.round(time),
                      title: note,
                      lectureId,
                    }),
                    {
                      success: (data) => {
                        setViewState('idle');
                        return data.message;
                      },
                      error: errorResolver(),
                      loading: 'updating-note....',
                    }
                  );
                  return;
                }
                toast.promise(
                  addNewNote({
                    noteInSecond: Math.round(time),
                    title: note,
                    lectureId,
                  }),
                  {
                    success: (data) => {
                      setViewState('idle');
                      return data.message;
                    },
                    error: errorResolver(),
                    loading: 'adding-note....',
                  }
                );
              }}
              note={savedNote?.title}
              time={Math.round(currentTime)}
            />
          </>
        )}
        <Group>
          <Select
            allowDeselect={false}
            defaultValue="all"
            data={[
              { value: 'all', label: 'All Lectures' },
              { value: 'id', label: 'Current Lecture' },
            ]}
            value={notesType}
            onChange={(value) => {
              setNotesType(value as typeof notesType);
            }}
          />
        </Group>
        {notes?.length > 0 ? (
          <Stack gap="sm">
            {notes?.map((note) => {
              return <CourseNoteItem key={note._id} {...note} />;
            })}
          </Stack>
        ) : (
          <EmptyListContent message="No notes created" />
        )}
      </Stack>
    </Container>
  );
}
