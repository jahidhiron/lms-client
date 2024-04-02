import {
  Box,
  Button,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  ThemeIcon,
} from '@mantine/core';
import { IconEditCircle, IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { FILE_TYPE, FileModel } from '~/features/file/file.model';
import { useFiles } from '~/features/file/use-file';
import DebounceInputField from '../DebounceInputField';
import ResourceListing from '../ResourceListing';

type LibraryFileListingProps = {
  type?: FILE_TYPE;
  onSelect: (_file: FileModel[]) => void;
  multiple?: boolean;
};

export default function LibraryFileListing({
  type,
  onSelect,
  multiple,
}: LibraryFileListingProps) {
  const [searchText, setSearchText] = useState('');
  const { files, isLoading } = useFiles({
    page: 1,
    size: 100,
    type,
    q: searchText,
  });

  const _onSelect = (files: FileModel[]) => {
    onSelect(files);
  };

  return (
    <Box py="sm">
      <Group mb="xs" justify="flex-end">
        <DebounceInputField
          onDebouncedChange={(value) => {
            setSearchText(value);
          }}
          rightSection={
            <ThemeIcon>
              <IconSearch size="15" />
            </ThemeIcon>
          }
        />
      </Group>
      <ScrollArea h={200}>
        {isLoading ? (
          <Stack gap="xs">
            <Skeleton h={30} />
            <Skeleton h={30} />
            <Skeleton h={30} />
            <Skeleton h={30} />
            <Skeleton h={30} />
          </Stack>
        ) : (
          <ResourceListing
            files={files}
            withAction={!multiple}
            actionSection={
              !multiple
                ? (file) => (
                    <Button
                      size="xs"
                      variant="subtle"
                      leftSection={<IconEditCircle />}
                      style={{ zIndex: 10 }}
                      onClick={() => _onSelect([file])}
                    >
                      Select
                    </Button>
                  )
                : undefined
            }
            multiSelect={multiple}
            onMultiSelect={multiple ? _onSelect : undefined}
          />
        )}
      </ScrollArea>
    </Box>
  );
}
