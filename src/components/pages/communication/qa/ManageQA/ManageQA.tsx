import { Box, Flex, Group } from '@mantine/core';
import QAList from '../QAList';
import { useState } from 'react';
import { QaModel } from '~/features/qa/qa.model';
import QACommentList from '../QACommentList';
type ManageQAProps = {};

export default function QA({}: ManageQAProps) {
  const [qaCommentList, setQaCommentList] = useState<QaModel>();
  const [replyView, setReplyView] = useState<boolean>(false);
  const [desc, setDesc] = useState<string>('');

  return (
    <Box>
      <Flex>
        <Group>
          <QAList
            setQaCommentList={setQaCommentList}
            setReplyView={setReplyView}
            setDesc={setDesc}
          />
        </Group>
        {qaCommentList ? (
          <Group>
            <QACommentList
              qaCommentList={qaCommentList}
              replyView={replyView}
              setReplyView={setReplyView}
              desc={desc}
              setDesc={setDesc}
            />
          </Group>
        ) : null}
      </Flex>
    </Box>
  );
}
