import { Button, Group, Stack } from '@mantine/core';
import { useState } from 'react';
import TextInput from '~/components/core/TextInput';

type ExternalResourcesLinkFormProps = {
  onSave: (_title: string, _url: string) => void;
  onCancel: () => void;
};

export default function ExternalResourcesLinkForm({
  onSave,
  onCancel,
}: ExternalResourcesLinkFormProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  return (
    <Stack py="xs">
      <TextInput
        label="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <TextInput
        type="url"
        label="External Url"
        onChange={(ev) => setUrl(ev.target.value)}
      />
      <Group justify="flex-end">
        <Button onClick={onCancel} size="xs" variant="outline" color="black">
          Cancel
        </Button>
        <Button onClick={() => onSave(title, url)} size="xs">
          Save
        </Button>
      </Group>
    </Stack>
  );
}
