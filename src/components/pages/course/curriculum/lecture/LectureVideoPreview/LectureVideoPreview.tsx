import {
  Button,
  Group,
  Paper,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { IconEditCircle } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
import { FileModel } from '~/features/file/file.model';
import { formatTimeFromSeconds, getStaticContentUrl } from '~/helpers/utils';
import classes from './LectureVideoPreview.module.css';

type LectureVideoPreviewProps = {
  video?: FileModel;
  onEdit: () => void;
  previewState?: boolean;
  onPreviewChange: (_checked: boolean) => void;
};

export default function LectureVideoPreview({
  video,
  onPreviewChange,
  previewState,
  onEdit,
}: LectureVideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current?.load();
    }
  }, [video]);

  return (
    <Paper p="xs" withBorder w="100%" className={classes.previewContainer}>
      <video ref={videoRef} width={200} controls={false}>
        <source src={getStaticContentUrl(video?.path || '')}></source>
      </video>
      <Stack px="xs" gap="xs" align="flex-start">
        <Title order={6}>{video?.name}</Title>
        <Text>{formatTimeFromSeconds(video?.timeLength || 0)}</Text>
        <Group justify="space-between" w="100%">
          <Button
            onClick={onEdit}
            leftSection={<IconEditCircle size="20" />}
            variant="subtle"
            size="xs"
          >
            Edit Content
          </Button>
          <Group>
            <Switch
              label="Preview"
              checked={previewState}
              onChange={(ev) => onPreviewChange(ev.target.checked)}
            />
          </Group>
        </Group>
      </Stack>
    </Paper>
  );
}
