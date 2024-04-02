import {
  Avatar,
  Group,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import { QACommentModel } from '~/features/qa/qa.model';
type QACommentItemProps = { comment: QACommentModel };

export default function QACommentItem({ comment }: QACommentItemProps) {
  return (
    <>
      <Group>
        <Avatar radius="xl">
          {comment?.updatedBy?.name
            ? comment?.updatedBy?.name[0].toUpperCase()
            : ''}
        </Avatar>
        <Title order={5}>{comment?.updatedBy.name}</Title>
        <Text size="sm">{comment?.updatedAt}</Text>
      </Group>
      <Group>
        <TypographyStylesProvider p="0" m="0" c="black">
          <div dangerouslySetInnerHTML={{ __html: comment?.desc || '' }} />
        </TypographyStylesProvider>
      </Group>
    </>
  );
}
