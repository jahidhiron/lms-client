import { Box, Button, Group, Stack } from '@mantine/core';
import { useState } from 'react';
import TextEditor from '~/components/core/TextEditor';

type AssignmentQuestionFormProps = {
  title: string;
  correctAnswer: string;
  onSave: (_title: string, _correctAnswer: string) => void;
  onCancel: () => void;
};

export default function AssignmentQuestionForm({
  title: _title,
  correctAnswer: _correctAnswer,
  onCancel,
  onSave,
}: AssignmentQuestionFormProps) {
  const [title, setTitle] = useState(_title);
  const [correctAnswer, setCorrectAnswer] = useState(_correctAnswer);
  return (
    <Box>
      <Stack>
        <TextEditor
          label="Question Title"
          labelProps={{ fw: 'bold', size: 'sm' }}
          value={title}
          onChange={(value) => {
            setTitle(value);
          }}
          withHeading
          withTypography
        />
        <TextEditor
          label="Correct Answer"
          labelProps={{ fw: 'bold', size: 'sm' }}
          value={correctAnswer}
          onChange={(value) => {
            setCorrectAnswer(value);
          }}
          withHeading
          withTypography
        />
      </Stack>
      <Group justify="flex-end" mt="xs">
        <Button size="xs" variant="outline" color="dark" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="xs"
          disabled={!title || !correctAnswer}
          onClick={() => onSave(title, correctAnswer)}
        >
          Save
        </Button>
      </Group>
    </Box>
  );
}
