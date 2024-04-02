import {
  Avatar,
  Group,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';
import { QaModel } from '~/features/qa/qa.model';
type QAItemProps = {
  qa: QaModel;
  setQaCommentList: Dispatch<SetStateAction<QaModel | undefined>>;
  setReplyView: Dispatch<SetStateAction<boolean>>;
  setDesc: Dispatch<SetStateAction<string>>;
};

export default function QA({
  qa,
  setQaCommentList,
  setReplyView,
  setDesc,
}: QAItemProps) {
  return (
    <Stack>
      <Group>
        <Group>
          <Avatar radius="xl">JH</Avatar>
          <Title
            order={5}
            onClick={() => {
              setQaCommentList(qa);
              setReplyView(false);
              setDesc('');
            }}
          >
            {qa?.title}
          </Title>
        </Group>
      </Group>
      <Group>
        <TypographyStylesProvider p="0" m="0" c="black">
          <div dangerouslySetInnerHTML={{ __html: qa?.desc || '' }} />
        </TypographyStylesProvider>
      </Group>
      <Group>
        <Title order={6}>{qa?.updatedBy?.name}</Title>
        <Text size="sm">{qa?.updatedAt}</Text>
      </Group>
      <Group>
        {qa?.comments.length > 0 ? (
          <>
            {qa?.comments?.length}{' '}
            {`${qa?.comments?.length > 1 ? 'answers' : 'answer'}`}
          </>
        ) : null}
        {qa?.comments.length > 0 && qa?.votes.length > 0 && ' ,'}
        {qa?.votes.length > 0 ? (
          <>
            {qa?.votes?.length} {`${qa?.votes?.length > 1 ? 'votes' : 'vote'}`}
          </>
        ) : null}
      </Group>
    </Stack>
  );
}
