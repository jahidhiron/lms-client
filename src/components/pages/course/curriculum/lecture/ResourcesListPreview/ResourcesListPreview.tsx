import {
  ActionIcon,
  Anchor,
  Button,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconExternalLink,
  IconFileCv,
  IconFilePlus,
  IconLink,
  IconTrash,
} from '@tabler/icons-react';
import Link from 'next/link';
import { LectureResourceModel } from '~/features/lecture/lecture.model';

type ResourcesListPreviewProps = {
  resources?: LectureResourceModel[];
  onAdd?: () => void;
  onRemove: (_id: string) => void;
};

export default function ResourcesListPreview({
  resources,
  onAdd,
  onRemove,
}: ResourcesListPreviewProps) {
  return (
    <Paper withBorder p="xs" w="100%">
      <Group>
        <Text c="dimmed">Resources</Text>
        <Button
          variant="subtle"
          size="xs"
          onClick={onAdd}
          leftSection={<IconFilePlus size="15" />}
        >
          Add New Resources
        </Button>
      </Group>
      <Stack mt="xs">
        {resources?.map((r) => (
          <Paper key={r._id} p="xs" withBorder>
            <Flex justify="space-between" align="center">
              <Group align="center" gap="xs">
                {r.fileId ? <IconFileCv size="15" /> : <IconLink size="15" />}
                <Title order={6} c="dimmed">
                  {r?.title}
                </Title>
                {r.link && (
                  <Anchor component={Link} target="_blank" href={r.link}>
                    <IconExternalLink size="15" />
                  </Anchor>
                )}
              </Group>
              <ActionIcon
                onClick={() => {
                  onRemove(r._id!);
                }}
                color="red"
              >
                <IconTrash size="15" />
              </ActionIcon>
            </Flex>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}
