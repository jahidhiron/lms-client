import { Box, Button, Flex, Group, Title } from '@mantine/core';
import { useState } from 'react';
import DebounceInputField from '~/components/core/DebounceInputField';
import { TITLE_MAX_CHAR } from '~/helpers/constants';
import classes from './LectureForm.module.css';
type LectureFormProps = {
  onSave: (_title: string) => void;
  onCancel: () => void;
  lectureIndex: number;
  title: string;
};

export default function LectureForm({
  lectureIndex,
  title: _title,
  onCancel,
  onSave,
}: LectureFormProps) {
  const [title, setTitle] = useState(_title);

  return (
    <Box className={classes.formContainer}>
      <Flex align={'center'} gap="xs">
        <Title order={6}>Lecture {lectureIndex + 1}: </Title>
        <DebounceInputField
          withCount
          maxLength={TITLE_MAX_CHAR}
          className={classes.input}
          value={title}
          onDebouncedChange={(title) => {
            setTitle(title);
          }}
        />
      </Flex>
      <Group mt="xs" justify="flex-end">
        <Button onClick={onCancel} size="xs" color="dark" variant="outline">
          Cancel
        </Button>
        <Button onClick={() => onSave(title)} size="xs" variant="filled">
          Save
        </Button>
      </Group>
    </Box>
  );
}
