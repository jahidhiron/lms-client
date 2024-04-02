import { ActionIcon, Flex, Group, Text, Title } from '@mantine/core';
import {
  IconArrowsVertical,
  IconEditCircle,
  IconFile,
  IconTrash,
} from '@tabler/icons-react';
import SortableList from '~/components/core/SortableList';
import classes from '../../common.module.css';

type SectionFormPreviewProps = {
  title: string;
  index: number;
  onEdit: () => void;
  onRemove: () => void;
};

export default function SectionFormPreview({
  index,
  title,
  onEdit,
  onRemove,
}: SectionFormPreviewProps) {
  return (
    <Flex
      className={classes.previewContainer}
      align="center"
      justify="flex-start"
      gap={'xs'}
    >
      <Title order={6}>Section {index + 1}: </Title>
      <Flex gap="2">
        <IconFile color="gray" />
        <Text>{title}</Text>
      </Flex>
      <Flex
        className={classes.previewActionContainer}
        align="center"
        justify="space-between"
      >
        <Group gap="xs" align="center">
          <ActionIcon onClick={onEdit} variant="outline">
            <IconEditCircle size="15" />
          </ActionIcon>
          <ActionIcon onClick={onRemove} color="red" variant="outline">
            <IconTrash size="15" />
          </ActionIcon>
          <SortableList.DragHandle>
            <ActionIcon variant="outline">
              <IconArrowsVertical size="15" />
            </ActionIcon>
          </SortableList.DragHandle>
        </Group>
      </Flex>
    </Flex>
  );
}
