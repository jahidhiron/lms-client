import { useQAs } from '~/features/qa/useQa';
import QAItem from '../QAItem';
import { Group, Stack, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { Dispatch, SetStateAction } from 'react';
import { QaModel } from '~/features/qa/qa.model';
type QAListProps = {
  setQaCommentList: Dispatch<SetStateAction<QaModel | undefined>>;
  setReplyView: Dispatch<SetStateAction<boolean>>;
  setDesc: Dispatch<SetStateAction<string>>;
};

export default function QA({
  setQaCommentList,
  setReplyView,
  setDesc,
}: QAListProps) {
  const { qas } = useQAs({ page: 1 });

  return (
    <>
      <Stack>
        <Group>
          <TextInput
            placeholder="Serach by keyword"
            rightSection={<IconSearch aria-label="Serach by keyword" />}
          />
        </Group>
        {qas.map((qa) => (
          <QAItem
            key={qa._id}
            qa={qa}
            setQaCommentList={setQaCommentList}
            setReplyView={setReplyView}
            setDesc={setDesc}
          />
        ))}
      </Stack>
    </>
  );
}
