import { Alert, Box, Button, Group, Image, Stack, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useEffect, useState } from 'react';
import FileUploader from '~/components/core/FileUploader';
import TextEditor from '~/components/core/TextEditor';
import { FileModel } from '~/features/file/file.model';
import { FILE_TYPE_DOCUMENT, FILE_TYPE_VIDEO } from '~/helpers/constants';
import { getStaticContentUrl, isEmptyObject } from '~/helpers/utils';

type AssignmentInstructionFormProps = {
  onSave: (
    _instructionDesc: string,
    _instructionFileId: string | null,
    _instructionVideoId: string | null
  ) => void;
  instructionDesc: string;
  instructionFileId?: string;
  instructionVideoId?: string;
  instructionFile?: FileModel;
  instructionVideo?: FileModel;
};

export default function AssignmentInstructionForm({
  onSave,
  instructionVideoId,
  instructionFileId,
  instructionFile: _instructionFile,
  instructionVideo: _instructionVideo,
  instructionDesc: _instructionDesc,
}: AssignmentInstructionFormProps) {
  const [instructionVideo, setInstructionVideo] = useState<
    FileModel | undefined
  >(isEmptyObject(_instructionVideo) ? undefined : _instructionVideo);
  const [instructionFile, setInstructionFile] = useState<FileModel | undefined>(
    isEmptyObject(_instructionFile) ? undefined : _instructionFile
  );
  const [instructionDesc, setInstructionDesc] = useState<string>('');

  const handelFileUpload = (type: 'file' | 'video') => () => {
    modals.open({
      size: 'lg',
      children: (
        <FileUploader
          fileType={type === 'file' ? FILE_TYPE_DOCUMENT : FILE_TYPE_VIDEO}
          onDone={(files) => {
            if (type == 'file') {
              setInstructionFile(files[0]);
            } else {
              setInstructionVideo(files[0]);
            }
            onSave(
              instructionDesc,
              type == 'file' ? files[0]._id : instructionFileId!,
              type == 'video' ? files[0]._id : instructionVideoId!
            );
            modals.closeAll();
          }}
        />
      ),
    });
  };
  const handelFileRemove = (type: 'file' | 'video') => () => {
    onSave(
      instructionDesc,
      type == 'file' ? null : instructionFileId!,
      type == 'video' ? null : instructionVideoId!
    );
  };

  useEffect(() => {
    if (instructionVideo?._id !== _instructionVideo?._id) {
      setInstructionVideo(
        isEmptyObject(_instructionVideo) ? undefined : _instructionVideo
      );
    }
    if (instructionFile?._id !== _instructionFile?._id) {
      setInstructionFile(
        isEmptyObject(_instructionFile) ? undefined : _instructionFile
      );
    }
    if (instructionDesc !== _instructionDesc) {
      setInstructionDesc(_instructionDesc);
    }
  }, [_instructionVideo, _instructionFile, _instructionDesc]);

  return (
    <div>
      <Stack>
        <Stack>
          <Group>
            <Title order={6}>Video Instruction</Title>
            {instructionVideo ? (
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
          {instructionVideo ? (
            <video
              width={300}
              src={getStaticContentUrl(instructionVideo?.path)}
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

        <Box>
          <TextEditor
            value={instructionDesc}
            onChange={(value) => {
              setInstructionDesc(value);
            }}
            label="Assignment Instructions"
            labelProps={{ fw: 'bold', size: 'sm' }}
            withTypography
            withHeading
            withList
          />
          <Button
            size="xs"
            mt="xs"
            disabled={instructionDesc == _instructionDesc}
            onClick={() => {
              onSave(
                instructionDesc,
                instructionFile?._id!,
                instructionVideo?._id!
              );
            }}
          >
            Save
          </Button>
        </Box>

        <Stack>
          <Group>
            <Title order={6}>Downloadable Resources</Title>
            {instructionFile ? (
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
          {instructionFile ? (
            <Alert color="dark">{instructionFile?.name}</Alert>
          ) : (
            'No Downloadable Resources'
          )}
        </Stack>
      </Stack>
    </div>
  );
}
