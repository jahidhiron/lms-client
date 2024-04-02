import {
  Badge,
  Center,
  Flex,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { useQueue } from '@mantine/hooks';
import { nanoid } from 'nanoid';
import { useEffect, useMemo, useState } from 'react';
import { FILE_TYPE, FileModel } from '~/features/file/file.model';
import { useFileMutations } from '~/features/file/use-file';
import {
  FILE_TYPE_AVATAR,
  FILE_TYPE_DOCUMENT,
  FILE_TYPE_THUMBNAIL,
  FILE_TYPE_VIDEO,
} from '~/helpers/constants';
import DropzoneButton from '../DropzoneButton';

type DropzoneContainerProps = {
  fileType: FILE_TYPE;
  multiple?: boolean;
  onDone: (_files: FileModel[], _viewReset: () => void) => void;
};

type FileUploadingState = 'idle' | 'progress' | 'complete' | 'failed';

type QueuedFileType = {
  id: string;
  file: FileWithPath;
};

const QueuedFileItem = ({
  fileName,
  progress,
  completed,
  error,
}: {
  fileName: string;
  progress?: number;
  completed?: boolean;
  error?: string;
}) => (
  <Paper w="100%" withBorder p="xs">
    <Flex align="center" gap="xl" justify="space-between">
      <Text lineClamp={1} w="100%">
        {fileName}
      </Text>
      {progress != 0 ? (
        <Flex w="100%" align="center" gap="sm">
          <Progress size="xs" value={progress || 0} w={'100%'} />
          <Text size="xs">{progress}%</Text>
        </Flex>
      ) : completed ? (
        <Flex justify="flex-end" w="100%">
          <Badge>Uploaded</Badge>
        </Flex>
      ) : error ? (
        <Flex justify="flex-end" w="100%">
          <Badge color="red">{error}</Badge>
        </Flex>
      ) : null}
    </Flex>
  </Paper>
);

export default function DropzoneContainer({
  fileType,
  multiple,
  onDone,
}: DropzoneContainerProps) {
  const queue = useQueue<QueuedFileType>({
    limit: 2,
    initialValues: [],
  });
  const mimeTypes = useMemo(() => {
    switch (fileType) {
      case FILE_TYPE_AVATAR:
      case FILE_TYPE_THUMBNAIL:
        return [MIME_TYPES.jpeg, MIME_TYPES.png, MIME_TYPES.webp];
      case FILE_TYPE_VIDEO:
        return [MIME_TYPES.mp4, MIME_TYPES.avif];
      case FILE_TYPE_DOCUMENT:
        return [
          MIME_TYPES.csv,
          MIME_TYPES.doc,
          MIME_TYPES.docx,
          MIME_TYPES.pdf,
          MIME_TYPES.ppt,
          MIME_TYPES.pptx,
          MIME_TYPES.xls,
          MIME_TYPES.xlsx,
          MIME_TYPES.zip,
        ];
      default:
        return [];
    }
  }, [fileType]);
  const { addNewFile } = useFileMutations();
  const [uploadingState, setUploadingState] =
    useState<FileUploadingState>('idle');
  const [currentProgress, setCurrentProgress] = useState<
    Record<string, number>
  >({});
  const [completedUploads, setCompletedUploads] = useState<
    Record<string, FileModel>
  >({});
  const [errorUploads, setErrorUploads] = useState<
    Record<string, { error: string; file: FileWithPath }>
  >({});
  const supportedFiles = useMemo(
    () => mimeTypes?.map((t) => t.split('/')?.at(-1)).join(', '),
    [mimeTypes]
  );

  const handleUploadFile = ({ file, id }: QueuedFileType) => {
    addNewFile({ file, type: fileType }, (progressEvent) => {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / (progressEvent?.total as number)
      );
      setCurrentProgress((prev) => ({ ...prev, [id]: percentCompleted }));
    })
      .then((data) => {
        setCompletedUploads((prev) => ({ ...prev, [id]: data?.data?.file }));
      })
      .catch((err) => {
        setErrorUploads((prev) => ({
          ...prev,
          [id]: {
            error: err?.response?.data?.message || err?.message,
            file,
          },
        }));
      })
      .finally(() => {
        queue.update((state) => state.filter((s) => s.id !== id));
        setCurrentProgress((prev) => ({ ...prev, [id]: 0 }));
      });
  };

  const onDrop = (files: FileWithPath[]) => {
    setUploadingState('progress');
    queue.add(...files.map((f) => ({ id: nanoid(), file: f })));
  };

  useEffect(() => {
    if (queue.state.length > 0) {
      queue.state.forEach((s) => {
        if (!Object.hasOwn(currentProgress, s.id)) {
          handleUploadFile(s);
        }
      });
    }
    if (
      queue.state.length == 0 &&
      queue.queue.length == 0 &&
      (Object.keys(completedUploads).length > 0 ||
        Object.keys(errorUploads).length > 0)
    ) {
      onDone(Object.values(completedUploads), () => {
        setUploadingState('idle');
        setCompletedUploads({});
        setErrorUploads({});
        setCurrentProgress({});
      });
    }
  }, [queue.state]);

  return (
    <>
      {uploadingState == 'progress' ? (
        <Stack w="100%" mt="xs">
          {queue.state.length > 0 && (
            <>
              <Title order={6}>Running</Title>
              {[...queue.state].map((queuedFile) => (
                <QueuedFileItem
                  key={queuedFile.id}
                  fileName={queuedFile.file?.name}
                  progress={currentProgress?.[queuedFile.id]}
                />
              ))}
            </>
          )}{' '}
          {queue.queue.length > 0 && (
            <>
              <Title order={6}>Queued</Title>
              {[...queue.queue].map((queuedFile) => (
                <QueuedFileItem
                  fileName={queuedFile.file?.name}
                  key={queuedFile.id}
                />
              ))}
            </>
          )}
          {Object.values(completedUploads).length > 0 && (
            <>
              <Title order={6}>Completed</Title>
              {Object.values(completedUploads).map((file) => (
                <QueuedFileItem
                  key={file._id}
                  fileName={file.name}
                  progress={0}
                  completed
                />
              ))}
            </>
          )}
          {Object.values(errorUploads).length > 0 && (
            <>
              <Title order={6}>Failed</Title>
              {Object.values(errorUploads).map((err, i) => (
                <QueuedFileItem
                  key={err.file.name + i}
                  fileName={err.file?.name}
                  progress={0}
                  error={err.error}
                />
              ))}
            </>
          )}
        </Stack>
      ) : (
        <Center p="md">
          <DropzoneButton
            fileType={mimeTypes}
            maxSizeInMb={1024}
            multiple={multiple}
            onDrop={onDrop}
            rejectMessage="Video file must be 1GB or less"
            subMessage={`Drag and drop here. Only accept ${supportedFiles} files. Size limit 1GB`}
          />
        </Center>
      )}
    </>
  );
}
