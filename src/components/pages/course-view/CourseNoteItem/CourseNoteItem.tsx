import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconEditCircle, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import TextEditor from '~/components/core/TextEditor';
import { NoteModel } from '~/features/note/note.model';
import { useNoteMutations } from '~/features/note/use-note';
import { errorResolver, formatTimeFromSeconds } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';

type CourseNoteItemProps = NoteModel;

export default function CourseNoteItem({
  noteInSecond,
  lectureId,
  lecture,
  title: _title,
  _id,
}: CourseNoteItemProps) {
  const { t: commonT } = useTranslation('common');
  const [preview, { open: previewOpen, close: previewClose }] =
    useDisclosure(true);
  const [title, setTitle] = useState('');
  const { updateNote, deleteNote } = useNoteMutations();

  useEffect(() => {
    if (title != _title) {
      setTitle(_title);
    }
  }, [_title]);

  const onRemoveNote = () => {
    modals.openConfirmModal({
      title: commonT('common.labels.remove', {
        feature: commonT('common.words.note'),
        title: '',
      }),
      centered: true,
      children: (
        <Text size="sm">
          {commonT('common.labels.remove-message', {
            feature: commonT('common.words.note'),
            title: '',
          })}
        </Text>
      ),
      labels: {
        confirm: commonT('common.words.confirm'),
        cancel: commonT('common.words.cancel'),
      },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        toast.promise(deleteNote(_id), {
          success: (data) => {
            return data.message;
          },
          error: errorResolver(),
          loading: 'deleting-note....',
        });
      },
    });
  };

  return (
    <Stack>
      <Group justify="space-between">
        <Group>
          <Badge>{formatTimeFromSeconds(noteInSecond || 0)}</Badge>
          <Title order={5}>{lecture.title}</Title>
        </Group>
        <Group>
          {preview ? (
            <>
              <ActionIcon size="md" onClick={previewClose}>
                <IconEditCircle size="15" />
              </ActionIcon>
              <ActionIcon size="md" color="red" onClick={onRemoveNote}>
                <IconTrash size="15" />
              </ActionIcon>
            </>
          ) : (
            <>
              <Button
                size="xs"
                variant="outline"
                color="dark"
                onClick={previewOpen}
              >
                Cancel
              </Button>
              <Button
                size="xs"
                onClick={() => {
                  toast.promise(
                    updateNote(_id, { title, lectureId, noteInSecond }),
                    {
                      success: (data) => {
                        previewOpen();
                        return data.message;
                      },
                      error: errorResolver(),
                      loading: 'updating-note....',
                    }
                  );
                }}
              >
                Save
              </Button>
            </>
          )}
        </Group>
      </Group>
      <Box ml={rem(70)}>
        {preview ? (
          <TypographyStylesProvider bg="gray.0" p="lg">
            <div dangerouslySetInnerHTML={{ __html: title || '' }} />
          </TypographyStylesProvider>
        ) : (
          <TextEditor
            value={title}
            onChange={(value) => {
              setTitle(value);
            }}
            withHeading
            withList
            withLink
            withTypography
          />
        )}
      </Box>
    </Stack>
  );
}
