import { Alert, Button, Group, Image, Stack, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useEffect, useState } from 'react';
import FileUploader from '~/components/core/FileUploader';
import { FileModel } from '~/features/file/file.model';
import { FILE_TYPE_DOCUMENT, FILE_TYPE_VIDEO } from '~/helpers/constants';
import { getStaticContentUrl, isEmptyObject } from '~/helpers/utils';

type AssignmentSolutionFormProps = {
  onSave: (
    _solutionFileId: string | null,
    _solutionVideoId: string | null
  ) => void;
  solutionFileId?: string;
  solutionVideoId?: string;
  solutionFile?: FileModel;
  solutionVideo?: FileModel;
};

export default function AssignmentSolutionForm({
  onSave,
  solutionVideoId,
  solutionFileId,
  solutionFile: _solutionFile,
  solutionVideo: _solutionVideo,
}: AssignmentSolutionFormProps) {
  const [solutionVideo, setSolutionVideo] = useState<FileModel | undefined>(
    isEmptyObject(_solutionVideo) ? undefined : _solutionVideo
  );
  const [solutionFile, setSolutionFile] = useState<FileModel | undefined>(
    isEmptyObject(_solutionFile) ? undefined : _solutionFile
  );

  const handelFileUpload = (type: 'file' | 'video') => () => {
    modals.open({
      size: 'lg',
      children: (
        <FileUploader
          fileType={type === 'file' ? FILE_TYPE_DOCUMENT : FILE_TYPE_VIDEO}
          onDone={(files) => {
            if (type == 'file') {
              setSolutionFile(files[0]);
            } else {
              setSolutionVideo(files[0]);
            }
            onSave(
              type == 'file' ? files[0]._id : solutionFileId!,
              type == 'video' ? files[0]._id : solutionVideoId!
            );
            modals.closeAll();
          }}
        />
      ),
    });
  };
  const handelFileRemove = (type: 'file' | 'video') => () => {
    onSave(
      type == 'file' ? null : solutionFileId!,
      type == 'video' ? null : solutionVideoId!
    );
  };

  useEffect(() => {
    if (solutionVideo?._id !== _solutionVideo?._id) {
      setSolutionVideo(
        isEmptyObject(_solutionVideo) ? undefined : _solutionVideo
      );
    }
    if (solutionFile?._id !== _solutionFile?._id) {
      setSolutionFile(isEmptyObject(_solutionFile) ? undefined : _solutionFile);
    }
  }, [_solutionVideo, _solutionFile]);

  return (
    <div>
      <Stack gap="md">
        <Stack>
          <Group>
            <Title order={6}>Video Solution</Title>
            {solutionVideo ? (
              <>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={handelFileUpload('video')}
                >
                  Change
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={handelFileRemove('video')}
                >
                  Delete
                </Button>
              </>
            ) : (
              <Button size="xs" onClick={handelFileUpload('video')}>
                Update Video
              </Button>
            )}
          </Group>
          {solutionVideo ? (
            <video
              width={300}
              src={getStaticContentUrl(solutionVideo?.path)}
              controls
            />
          ) : (
            <Image
              w="200"
              src="/placeholder.jpg"
              fit="contain"
              alt="placeholder"
            />
          )}
        </Stack>

        <Stack>
          <Group>
            <Title order={6}>Downloadable Resources</Title>
            {solutionFile ? (
              <>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={handelFileUpload('file')}
                >
                  Change
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={handelFileRemove('file')}
                >
                  Delete
                </Button>
              </>
            ) : (
              <Button size="xs" onClick={handelFileUpload('file')}>
                Update File
              </Button>
            )}
          </Group>
          {solutionFile ? (
            <Alert color="dark">{solutionFile?.name}</Alert>
          ) : (
            'No Downloadable Resources'
          )}
        </Stack>
      </Stack>
    </div>
  );
}
