import {
  Box,
  Button,
  Flex,
  Group,
  Paper,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import DebounceInputField from '~/components/core/DebounceInputField';
import { TITLE_MAX_CHAR } from '~/helpers/constants';
import classes from './SectionForm.module.css';

type SectionFormProps = {
  onCancel: () => void;
  onSave: (_title: string, _desc: string) => void;
  index: number;
  title: string;
  desc: string;
};

export default function SectionForm({
  onCancel,
  onSave,
  title: _title,
  index,
  desc: _desc,
}: SectionFormProps) {
  const [title, setTitle] = useState(_title);
  const [desc, setDesc] = useState(_desc);

  return (
    <Paper withBorder bg="white" p="sm">
      <Flex gap="sm">
        <Title order={6} mt="7">
          Section {index + 1}:{' '}
        </Title>
        <Box className={classes.formInputContainer}>
          <DebounceInputField
            withCount
            maxLength={TITLE_MAX_CHAR}
            onDebouncedChange={(value) => {
              setTitle(value);
            }}
            value={title}
          />
          <Title order={6} my="xs">
            What will students be able to do at the end of this section?
          </Title>
          <TextInput
            onChange={(ev) => {
              setDesc(ev.target.value);
            }}
            value={desc}
          />
        </Box>
      </Flex>
      <Group align="center" justify="flex-end" pt="sm">
        <Button onClick={onCancel} size="xs" variant="outline" color="dark">
          Cancel
        </Button>
        <Button size="xs" type="submit" onClick={() => onSave(title, desc)}>
          Save
        </Button>
      </Group>
    </Paper>
  );
}
