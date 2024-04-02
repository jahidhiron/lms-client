import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Button,
  Flex,
  Group,
  Text,
} from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconEditCircle, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { useState, type FC } from 'react';
import toast from 'react-hot-toast';
import TextInput from '~/components/core/TextInput';
import { AnnouncementCommentModel } from '~/features/announcement/announcement.model';
import { useAnnouncementCommentMutations } from '~/features/announcementComment/use-announcementComment';
import useAuth from '~/features/auth/use-auth';
import { convertToHumanReadable, errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';

interface AnnouncementCommentItemProps {
  comment: AnnouncementCommentModel;
  announcementId: string;
}
const AnnouncementCommentItem: FC<AnnouncementCommentItemProps> = ({
  announcementId,
  comment,
}) => {
  const { t: commonT } = useTranslation('common');
  const { ref, hovered } = useHover();
  const { session } = useAuth();
  const [editable, setEditable] = useState(false);
  const [commentText, setCommentText] = useState(comment?.title);
  const { updateAnnouncementComment, deleteAnnouncementComment } =
    useAnnouncementCommentMutations();
  const onSave = () => {
    toast.promise(
      updateAnnouncementComment(announcementId, {
        commentId: comment._id,
        title: commentText,
      }),
      {
        success: (data) => {
          setEditable(false);
          return data.message;
        },
        error: errorResolver(),
        loading: 'updating...',
      }
    );
  };

  const onDelete = () => {
    modals.openConfirmModal({
      title: commonT('common.labels.remove', {
        feature: commonT('common.words.comment'),
        title: comment.title,
      }),
      centered: true,
      children: (
        <Text size="sm">
          {commonT('common.labels.remove-message', {
            feature: commonT('common.words.comment'),
            title: comment?.title,
          })}
        </Text>
      ),
      labels: {
        confirm: commonT('common.words.confirm'),
        cancel: commonT('common.words.cancel'),
      },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        toast.promise(deleteAnnouncementComment(announcementId, comment._id), {
          success: (data) => {
            return data.message;
          },
          error: errorResolver(),
          loading: 'deleting...',
        });
      },
    });
  };

  return (
    <Flex gap="sm" ref={ref} w="100%" key={comment._id}>
      <Avatar c="dark" bg="dark">
        {comment?.updatedBy?.name?.slice(0, 2)?.toUpperCase()}
      </Avatar>
      <Box w="100%">
        <Group>
          <Anchor component={Link} href="#">
            {comment?.updatedBy?.name}
          </Anchor>
          <Text>{convertToHumanReadable(comment?.updatedAt)}</Text>
          {session?._id === comment.updatedBy?._id && (
            <Group opacity={editable ? 1 : !hovered ? 0 : 1}>
              {editable ? (
                <>
                  <Button size="xs" onClick={onSave}>
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setEditable(false);
                    }}
                    variant="outline"
                    size="xs"
                    color="dark"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <ActionIcon
                    size="md"
                    variant="outline"
                    onClick={() => {
                      setEditable(true);
                    }}
                  >
                    <IconEditCircle size="15" />
                  </ActionIcon>
                  <ActionIcon
                    onClick={onDelete}
                    size="md"
                    color="red"
                    variant="outline"
                  >
                    <IconTrash size="15" />
                  </ActionIcon>
                </>
              )}
            </Group>
          )}
        </Group>
        <Group w="100%">
          {editable ? (
            <TextInput
              my="xs"
              w="100%"
              onChange={(ev) => {
                setCommentText(ev.target.value);
              }}
              value={commentText}
              autoFocus
            />
          ) : (
            <Text>{comment?.title}</Text>
          )}
        </Group>
      </Box>
    </Flex>
  );
};

export default AnnouncementCommentItem;
