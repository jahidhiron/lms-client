import { Button, Group, Text, rem, useMantineTheme } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { useRef } from 'react';
import classes from './DropzoneButton.module.css';

type DropzoneButtonProps = {
  fileType: string[];
  subMessage: string;
  maxSizeInMb: number;
  acceptMessage?: string;
  idleMessage?: string;
  rejectMessage: string;
  multiple?: boolean;
  onDrop: (_files: FileWithPath[]) => void;
};

export default function DropzoneButton({
  fileType,
  maxSizeInMb,
  subMessage,
  rejectMessage,
  multiple,
  onDrop,
  acceptMessage = 'Drop files here',
  idleMessage = 'Upload Files',
}: DropzoneButtonProps) {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);

  return (
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={onDrop}
        multiple={multiple}
        className={classes.dropzone}
        radius="md"
        accept={fileType}
        maxSize={maxSizeInMb * 1024 ** 2}
      >
        <div style={{ pointerEvents: 'none' }}>
          <Group justify="center">
            <Dropzone.Accept>
              <IconDownload
                style={{ width: rem(50), height: rem(50) }}
                color={theme.colors.blue[6]}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{ width: rem(50), height: rem(50) }}
                color={theme.colors.red[6]}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload
                style={{ width: rem(50), height: rem(50) }}
                stroke={1.5}
              />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="xl">
            <Dropzone.Accept>{acceptMessage}</Dropzone.Accept>
            <Dropzone.Reject>{rejectMessage}</Dropzone.Reject>
            <Dropzone.Idle>{idleMessage}</Dropzone.Idle>
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            {subMessage}
          </Text>
        </div>
      </Dropzone>

      <Button
        className={classes.control}
        size="md"
        radius="xl"
        onClick={() => openRef.current?.()}
      >
        Select files
      </Button>
    </div>
  );
}
