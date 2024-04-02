import { ActionIcon, Button, Flex, Grid, Text, Title } from '@mantine/core';
import {
  IconArrowsVertical,
  IconChevronDown,
  IconEditCircle,
  IconFile,
  IconTrash,
} from '@tabler/icons-react';
import { ReactNode } from 'react';
import SortableList from '~/components/core/SortableList';
import classes from '../common.module.css';

type SectionItemPreviewProps = {
  title: string;
  itemIndex: number;
  collapsedState: boolean;
  icon?: ReactNode;
  onEdit: () => void;
  onRemove: () => void;
  onToggleCollapsed: () => void;
  toggleLabel?: string;
  sectionName: string;
};

export default function SectionItemPreview({
  onEdit,
  onRemove,
  collapsedState,
  onToggleCollapsed,
  toggleLabel = 'Contents',
  itemIndex,
  title,
  sectionName,
  icon = <IconFile size="20" />,
}: SectionItemPreviewProps) {
  return (
    <Flex align="center" gap="xs" className={classes.previewContainer}>
      <Grid w="100%" align="center">
        <Grid.Col span={3}>
          <Title order={6} ta="right">
            {sectionName} {itemIndex + 1}:{' '}
          </Title>
        </Grid.Col>
        <Grid.Col span={9}>
          <Flex align="center" gap="5">
            {icon}
            <Text>{title}</Text>
          </Flex>
        </Grid.Col>
      </Grid>
      <Flex align="center" gap="xs" className={classes.previewActionContainer}>
        <ActionIcon onClick={onEdit} variant="outline">
          <IconEditCircle size="15" />
        </ActionIcon>
        <ActionIcon onClick={onRemove} variant="outline" color="red">
          <IconTrash size="15" />
        </ActionIcon>
        <SortableList.DragHandle>
          <ActionIcon variant="outline">
            <IconArrowsVertical size="15" />
          </ActionIcon>
        </SortableList.DragHandle>
      </Flex>
      <Flex gap="xs">
        <Button
          onClick={onToggleCollapsed}
          size="xs"
          variant={!collapsedState ? 'outline' : 'filled'}
          leftSection={
            <IconChevronDown
              className={classes.collapsedIcon}
              data-collapsed={collapsedState}
            />
          }
        >
          {toggleLabel}
        </Button>
      </Flex>
    </Flex>
  );
}
