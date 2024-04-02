import { Button, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconFile,
  IconInfoCircle,
  IconPlus,
  IconSquaresDiagonal,
  IconX,
} from '@tabler/icons-react';
import {
  SECTION_ITEM_ASSIGNMENT,
  SECTION_ITEM_LECTURE,
  SECTION_ITEM_QUIZ,
} from '~/helpers/constants';

type AddSectionItemButtonProps = {
  onPress: (_itemType: number) => void;
  disabled?: boolean;
};

export default function AddSectionItemButton({
  onPress,
  disabled,
}: AddSectionItemButtonProps) {
  const [menuOpened, { open: onMenuOpen, close: onMenuClose }] =
    useDisclosure(false);
  return (
    <Menu onOpen={onMenuOpen} onClose={onMenuClose} disabled={disabled}>
      <Menu.Target>
        <Button
          disabled={disabled}
          leftSection={
            menuOpened ? <IconX size="15" /> : <IconPlus size="15" />
          }
          variant="filled"
          size="xs"
        >
          Add Item
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconFile size="20" />}
          onClick={() => onPress(SECTION_ITEM_LECTURE)}
        >
          Lecture
        </Menu.Item>
        <Menu.Item
          leftSection={<IconInfoCircle size="20" />}
          onClick={() => onPress(SECTION_ITEM_QUIZ)}
        >
          Quiz
        </Menu.Item>
        <Menu.Item
          onClick={() => onPress(SECTION_ITEM_ASSIGNMENT)}
          leftSection={<IconSquaresDiagonal size="20" />}
        >
          Assignment
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
