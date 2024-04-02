import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Flex,
  Group,
  Stack,
  Text,
  TypographyStylesProvider,
} from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import TextInput from '~/components/core/TextInput';
import EmptyListContent from '~/components/utils/EmptyListContent';
import { AnnouncementModel } from '~/features/announcement/announcement.model';
import { useAnnouncementCommentMutations } from '~/features/announcementComment/use-announcementComment';
import { convertToHumanReadable, errorResolver } from '~/helpers/utils';
import AnnouncementCommentItem from './components/AnnouncementCommentItem';

type CourseAnnouncementItemProps = AnnouncementModel & {};

export default function CourseAnnouncementItem({
  comments,
  title,
  desc,
  _id,
  updatedAt,
  updatedBy,
}: CourseAnnouncementItemProps) {
  const [comment, setComment] = useState('');
  const { addNewAnnouncementComment } = useAnnouncementCommentMutations();
  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!comment) {
      return;
    }
    toast.promise(addNewAnnouncementComment(_id, { title: comment }), {
      success: (data) => {
        setComment('');
        return data.message;
      },
      error: errorResolver(),
      loading: 'adding...',
    });
  };
  return (
    <div>
      <Group w="100%">
        <Avatar />
        <Box>
          <Anchor component={Link} href="#">
            Omar Faruk
          </Anchor>
          <Group>
            <Text>posted an announcement</Text>
            <Text>{convertToHumanReadable(updatedAt)}</Text>
          </Group>
        </Box>
      </Group>
      <Box>
        <TypographyStylesProvider pl="0" py="sm">
          <div
            dangerouslySetInnerHTML={{
              __html: desc,
            }}
          />
        </TypographyStylesProvider>
      </Box>
      <Box>
        <form onSubmit={onSubmit}>
          <Flex gap="md" align="center">
            <Avatar c="dark" bg="dark">
              OF
            </Avatar>
            <TextInput
              size="md"
              w="100%"
              maxLength={40}
              multiline
              withCount
              onChange={(ev) => setComment(ev.target.value)}
              value={comment}
              rightSection={
                <ActionIcon type="submit">
                  <IconSend size="15" />
                </ActionIcon>
              }
            />
          </Flex>
        </form>
        <Stack mt="md">
          {comments?.length > 0 ? (
            comments?.map((comment) => (
              <AnnouncementCommentItem
                comment={comment}
                announcementId={_id}
                key={comment._id}
              />
            ))
          ) : (
            <EmptyListContent message="no comments found" />
          )}
        </Stack>
      </Box>
    </div>
  );
}
