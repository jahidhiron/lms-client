import { Badge, Box, Button, Flex, Group, Stack } from '@mantine/core';
import { useState } from 'react';
import TextEditor from '~/components/core/TextEditor';
import { formatTimeFromSeconds } from '~/helpers/utils';

type CourseNotesFormProps = {
  time: number;
  note?: string;
  onSave(_time: number, _note: string): void;
  onCancel(): void;
};

export default function CourseNotesForm({
  note = '',
  time,
  onSave,
  onCancel,
}: CourseNotesFormProps) {
  const [currentNote, setNote] = useState(note);
  return (
    <Stack w="100%">
      <Flex gap="xs" w="100%">
        <Badge>{formatTimeFromSeconds(time)}</Badge>
        <Box style={{ flex: 1 }}>
          <TextEditor
            onChange={(value) => setNote(value)}
            value={currentNote}
            withHeading
            withLink
            withTypography
          />
        </Box>
      </Flex>
      <Group align="center" justify="flex-end">
        <Button size="xs" color="dark" onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button size="xs" onClick={() => onSave(time, currentNote)}>
          Save
        </Button>
      </Group>
    </Stack>
  );
}
