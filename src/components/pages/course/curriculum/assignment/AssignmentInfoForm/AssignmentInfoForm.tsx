import { Box, Button, Flex, Group, Title } from '@mantine/core';
import { useState } from 'react';
import DebounceInputField from '~/components/core/DebounceInputField';
import { TITLE_MAX_CHAR } from '~/helpers/constants';
import classes from './AssignmentInfoForm.module.css';

type AssignmentInfoFormProps = {
  title: string;
  assignmentIndex: number;
  onCancel: () => void;
  onSave: (_title: string) => void;
};

export default function AssignmentInfoForm({
  title: _title,
  assignmentIndex,
  onCancel,
  onSave,
}: AssignmentInfoFormProps) {
  const [title, setTitle] = useState(_title);

  return (
    <Box className={classes.formContainer}>
      <Flex align={'center'} gap="xs">
        <Title order={6}>Assignment {assignmentIndex + 1}: </Title>
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
