import {
  Button,
  Group,
  Paper,
  Spoiler,
  Text,
  TypographyStylesProvider,
} from '@mantine/core';
import { IconEditCircle } from '@tabler/icons-react';

type LectureDescriptionPreviewProps = {
  onEdit: () => void;
  desc?: string;
};

export default function LectureDescriptionPreview({
  desc,
  onEdit,
}: LectureDescriptionPreviewProps) {
  return (
    <Paper withBorder p="xs" w="100%">
      <Group>
        <Text c="dimmed">Description</Text>
        <Button
          size="xs"
          variant="subtle"
          onClick={onEdit}
          leftSection={<IconEditCircle size="20" />}
        >
          Edit Description
        </Button>
      </Group>

      <Spoiler hideLabel="Hide Description" showLabel="Show Full Description">
        <TypographyStylesProvider px={0} mt={0}>
          <div dangerouslySetInnerHTML={{ __html: desc || '' }}></div>
        </TypographyStylesProvider>
      </Spoiler>
    </Paper>
  );
}
