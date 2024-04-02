import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconArrowsVertical, IconPlus, IconTrash } from '@tabler/icons-react';
import { nanoid } from 'nanoid';
import useTranslation from '~/hooks/use-translation';
import DebounceInputField from '../DebounceInputField';
import SortableList, { BaseItem } from '../SortableList/SortableList';
import classes from './ListInput.module.css';

type ListInputProps = {
  title: string;
  subTitle: string;
  onAddNew: (_value: BaseItem) => void;
  onRemove: (_value: BaseItem) => void;
  onReorder: (_values: BaseItem[]) => void;
  onInputChange: (_index: number, _value: string) => void;
  values: BaseItem[];
};

export default function ListInput({
  title,
  subTitle,
  onAddNew,
  onRemove,
  onReorder,
  onInputChange,
  values,
}: ListInputProps) {
  const { t: intendedT } = useTranslation('intended-learners');

  return (
    <Box className={classes.wrapper}>
      <Title order={4}>{title}</Title>
      <Text size="md" my="xs">
        {subTitle}
      </Text>

      <SortableList
        items={values}
        getItemId={(item) => item.id}
        onChange={onReorder}
        renderItem={(item, index, getId) => (
          <SortableList.Item id={getId?.(item)!}>
            <Flex align="center" justify="flex-start" gap="sm">
              <DebounceInputField
                miw="400"
                size="md"
                placeholder=""
                onDebouncedChange={(value) => {
                  if (String(index) !== 'undefined') {
                    onInputChange(index!, value);
                  }
                }}
                value={item.value}
              />
              <SortableList.DragHandle>
                <ThemeIcon size="lg" variant="light">
                  <IconArrowsVertical size="20" />
                </ThemeIcon>
              </SortableList.DragHandle>
              <ActionIcon
                color="red"
                variant="filled"
                size="lg"
                disabled={values.length <= 4}
                onClick={() => onRemove(item)}
              >
                <IconTrash size="20" />
              </ActionIcon>
            </Flex>
          </SortableList.Item>
        )}
      />

      <Button
        variant="transparent"
        mt="xs"
        disabled={values.filter((v) => v.value.length == 0).length > 0}
        onClick={() => {
          onAddNew({ id: nanoid(), value: '' });
        }}
        leftSection={<IconPlus size="15" />}
      >
        {intendedT('add-more')}
      </Button>
    </Box>
  );
}
