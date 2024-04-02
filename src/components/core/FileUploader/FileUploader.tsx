import { Tabs, rem } from '@mantine/core';
import { IconMessageCircle, IconPhoto } from '@tabler/icons-react';
import { FILE_TYPE, FileModel } from '~/features/file/file.model';
import DropzoneContainer from '../DropzoneContainer';
import LibraryFileListing from '../LibraryFileListing';
import classes from './FileUploader.module.css';

type FileUploaderProps = {
  fileType: FILE_TYPE;
  multiple?: boolean;
  onDone: (_file: FileModel[]) => void;
};

export default function FileUploader({
  fileType,
  onDone,
  multiple,
}: FileUploaderProps) {
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Tabs defaultValue="device" mt="0" className={classes.wrapper}>
      <Tabs.List>
        <Tabs.Tab value="device" leftSection={<IconPhoto style={iconStyle} />}>
          Upload From Your Device
        </Tabs.Tab>
        <Tabs.Tab
          value="library"
          leftSection={<IconMessageCircle style={iconStyle} />}
        >
          Add from your library
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="device">
        <DropzoneContainer
          onDone={onDone}
          fileType={fileType}
          multiple={multiple}
        />
      </Tabs.Panel>

      <Tabs.Panel value="library">
        <LibraryFileListing
          multiple={multiple}
          type={fileType}
          onSelect={onDone}
        />
      </Tabs.Panel>
    </Tabs>
  );
}
