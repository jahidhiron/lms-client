import {
  Anchor,
  Avatar,
  Button,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import QACommentItem from '../QACommentItem';
import { QaModel } from '~/features/qa/qa.model';
import { useCourse } from '~/features/course/use-course';
import TextEditor from '~/components/core/TextEditor';
import { Dispatch, SetStateAction } from 'react';
import { useQAMutations } from '~/features/qa/useQa';
import toast from 'react-hot-toast';
import { errorResolver } from '~/helpers/utils';
import useTranslation from 'next-translate/useTranslation';
type QACommentListProps = {
  qaCommentList: QaModel | undefined;
  replyView: boolean;
  desc: string;
  setReplyView: Dispatch<SetStateAction<boolean>>;
  setDesc: Dispatch<SetStateAction<string>>;
};

export default function QACommentList({
  qaCommentList,
  replyView,
  setReplyView,
  desc,
  setDesc,
}: QACommentListProps) {
  const { course } = useCourse({ id: qaCommentList?.courseId! });
  const { t: commonT } = useTranslation('common');

  const { addReplyQA } = useQAMutations();
  return (
    <>
      <Stack>
        <Group>
          <Avatar radius="sm">CR</Avatar>
          Public question in <Anchor>{course?.title}</Anchor>
        </Group>
        <Group>
          <Avatar radius="xl">
            {qaCommentList?.updatedBy.name
              ? qaCommentList?.updatedBy.name[0].toUpperCase()
              : ''}
          </Avatar>
          <Title order={5}>{qaCommentList?.updatedBy.name}</Title>
          <Text size="sm">{qaCommentList?.updatedAt}</Text>
        </Group>
        <Group>
          <Title order={4}>{qaCommentList?.title}</Title>
        </Group>
        {qaCommentList?.comments.length! > 0 ? (
          <Title order={4}>
            {qaCommentList?.comments.length}{' '}
            {`${qaCommentList?.comments.length! > 1 ? 'answers' : 'answer'}`}
          </Title>
        ) : (
          ''
        )}
        <Divider />
        {qaCommentList?.comments.map((comment) => (
          <QACommentItem key={comment._id} comment={comment} />
        ))}
        {!replyView && (
          <TextInput
            placeholder="Post apublic answer..."
            onClick={() => setReplyView(true)}
          />
        )}
        {replyView && (
          <TextEditor
            onChange={(value) => setDesc(value)}
            value={desc}
            withHeading
            withLink
            withTypography
          />
        )}
        <Button
          onClick={() => {
            toast.promise(addReplyQA(qaCommentList?._id!, { desc }), {
              success: (data) => {
                setReplyView(false);
                setDesc('');
                return data.message;
              },
              error: errorResolver(),
              loading: commonT('common.loading.create', {
                feature: commonT('common.words.course'),
              }),
            });
          }}
          disabled={!desc}
        >
          Post
        </Button>
      </Stack>
    </>
  );
}
