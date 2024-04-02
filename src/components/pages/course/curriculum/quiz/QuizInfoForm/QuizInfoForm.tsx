import { Box, Button, Flex, Group, Text } from '@mantine/core';
import { useState } from 'react';
import TextEditor from '~/components/core/TextEditor';
import TextInput from '~/components/core/TextInput';
import { TITLE_MAX_CHAR } from '~/helpers/constants';
import classes from './QuizInfoForm.module.css';
type QuizInfoFormProps = {
  onSave: (_title: string, _desc: string) => void;
  onCancel: () => void;
  quizIndex: number;
  title: string;
  desc: string;
};

export default function QuizInfoForm({
  quizIndex,
  title: _title,
  desc: _desc,
  onCancel,
  onSave,
}: QuizInfoFormProps) {
  const [title, setTitle] = useState(_title);
  const [desc, setDesc] = useState(_desc);

  return (
    <Box className={classes.formContainer}>
      <Flex align={'flex-start'} gap="xs">
        <Text size="sm" truncate fw="bold">
          Quiz {quizIndex + 1}:{' '}
        </Text>
        <Box style={{ flex: 1 }}>
          <TextInput
            mb="xs"
            withCount
            maxLength={TITLE_MAX_CHAR}
            className={classes.input}
            value={title}
            onChange={(ev) => {
              setTitle(ev.target.value);
            }}
          />
          <TextEditor
            value={desc}
            onChange={(html) => {
              setDesc(html);
            }}
            withTypography
            withImage
          />
        </Box>
      </Flex>
      <Group mt="xs" justify="flex-end">
        <Button onClick={onCancel} size="xs" color="dark" variant="outline">
          Cancel
        </Button>
        <Button onClick={() => onSave(title, desc)} size="xs" variant="filled">
          Save
        </Button>
      </Group>
    </Box>
  );
}
