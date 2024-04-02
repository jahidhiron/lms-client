import { Box, Button, Group, Text } from '@mantine/core';
import { useState } from 'react';
import TextEditor from '~/components/core/TextEditor';

type LectureDescriptionFormProps = {
  onSave: (_desc: string) => void;
  onCancel: () => void;
  desc: string;
};

export default function LectureDescriptionForm({
  onSave,
  onCancel,
  desc: _desc,
}: LectureDescriptionFormProps) {
  const [desc, setDesc] = useState(_desc);

  return (
    <Box py="xs">
      <Text size="xs" c="dimmed">
        Description
      </Text>
      <TextEditor
        value={desc}
        onChange={(html) => {
          setDesc(html);
        }}
        withTypography
        withList
        withHeading
        withLink
      />
      <Group justify="flex-end" w="100%" mt="xs">
        <Button onClick={onCancel} size="xs" variant="outline" color="dark">
          Cancel
        </Button>
        <Button size="xs" onClick={() => onSave(desc)}>
          Save
        </Button>
      </Group>
    </Box>
  );
}
