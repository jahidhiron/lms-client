import { Button, Checkbox, Flex, Table, Text } from '@mantine/core';
import { ReactNode, useState } from 'react';
import { FileModel } from '~/features/file/file.model';
import { unitFormatter } from '~/helpers/utils';

type ResourceListingProps = {
  files?: FileModel[];
  withAction?: boolean;
  multiSelect?: boolean;
  actionSection?: (_file: FileModel) => ReactNode;
  onMultiSelect?: (_files: FileModel[]) => void;
};

export default function ResourceListing({
  files,
  withAction = false,
  multiSelect,
  actionSection,
  onMultiSelect,
}: ResourceListingProps) {
  const [selects, setSelects] = useState<FileModel[]>([]);

  return (
    <Table withRowBorders>
      <Table.Thead>
        <Table.Tr>
          {multiSelect && (
            <Table.Th pos="sticky" top="0" bg="white" style={{ zIndex: 20 }}>
              <Checkbox
                indeterminate={
                  selects.length > 0 &&
                  selects.length < (files?.length as number)
                }
                checked={selects.length == (files?.length as number)}
                onChange={(ev) => {
                  if (ev.target.checked) {
                    setSelects(files || []);
                  } else {
                    setSelects([]);
                  }
                }}
              />
            </Table.Th>
          )}
          <Table.Th
            pos="sticky"
            top="0"
            style={{ backgroundColor: 'white', zIndex: 40 }}
          >
            File Name
          </Table.Th>
          <Table.Th
            pos="sticky"
            top="0"
            style={{ backgroundColor: 'white', zIndex: 40 }}
          >
            Type
          </Table.Th>
          <Table.Th
            pos="sticky"
            top="0"
            style={{ backgroundColor: 'white', zIndex: 40 }}
          >
            Size
          </Table.Th>
          {/* <Table.Th pos="sticky" top="0" bg="white">
            Date
          </Table.Th> */}
          {withAction && (
            <Table.Th
              pos="sticky"
              top="0"
              bg="white"
              style={{ backgroundColor: 'white', zIndex: 40 }}
            ></Table.Th>
          )}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {(files?.length as number) > 0 ? (
          files?.map((file) => (
            <Table.Tr key={file._id}>
              {multiSelect && (
                <Table.Td>
                  <Checkbox
                    checked={selects.includes(file)}
                    onChange={(ev) => {
                      if (ev.target.checked) {
                        setSelects((prev) => [...prev, file]);
                      } else {
                        setSelects((prev) => prev.filter((f) => f != file));
                      }
                    }}
                  />
                </Table.Td>
              )}
              <Table.Td>
                <Text maw="300" style={{ wordBreak: 'break-all' }}>
                  {file.name}
                </Text>
              </Table.Td>
              <Table.Td>{file.mimetype}</Table.Td>
              <Table.Td>{unitFormatter(file?.size)}</Table.Td>
              {/* <Table.Td>
                <Text truncate>{dateFormatter(file.createdAt)}</Text>
              </Table.Td> */}
              {withAction && (
                <Table.Td
                  pos="sticky"
                  right={0}
                  style={{ zIndex: 5 }}
                  bg={'white'}
                >
                  {actionSection?.(file)}
                </Table.Td>
              )}
            </Table.Tr>
          ))
        ) : (
          <Table.Tr>
            <Table.Td colSpan={4} ta="center">
              No Files Found
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
      {multiSelect && (
        <Table.Tfoot>
          <Table.Tr>
            <Table.Td
              pos={'sticky'}
              bottom={0}
              bg="white"
              colSpan={5}
              style={{ zIndex: 20 }}
            >
              <Flex align="center" justify="space-between">
                <Text c="dimmed" size="xs">
                  Selected Resources ({selects.length})
                </Text>
                <Button
                  size="xs"
                  onClick={() => {
                    onMultiSelect?.(selects);
                  }}
                >
                  Add {selects.length} Resources
                </Button>
              </Flex>
            </Table.Td>
          </Table.Tr>
        </Table.Tfoot>
      )}
    </Table>
  );
}
