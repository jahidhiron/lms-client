import { ActionIcon, Group, Menu, Switch, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCheck, IconTextCaption } from '@tabler/icons-react';

export type CaptionModel = {
  lang: string;
  url: string;
};
type CaptionButtonProps = {
  captions: CaptionModel[];
  onChange(_caption: CaptionModel): void;
  caption?: CaptionModel;
  active?: boolean;
  onActiveStateChange(_active: boolean): void;
};

export default function CaptionButton({
  caption,
  captions,
  onChange,
  active,
  onActiveStateChange,
}: CaptionButtonProps) {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <Menu
      position="top"
      withArrow
      portalProps={{
        style: {
          zIndex: 9999999999,
        },
      }}
      withinPortal={false}
      onClose={close}
      onOpen={open}
      shadow="md"
      opened={opened}
    >
      <Menu.Target>
        <Tooltip label="Caption">
          <ActionIcon
            // onMouseEnter={open}
            onClick={open}
            // onMouseLeave={close}
            variant="light"
          >
            <IconTextCaption stroke={1} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown
        onMouseLeave={close}
        onMouseEnter={open}
        bg="dark"
        color="white"
        style={{ zIndex: 99999999999 }}
      >
        {captions?.map((cap) => {
          return (
            <Menu.Item
              onClick={() => {
                if (!active) {
                  onActiveStateChange(true);
                }
                onChange(cap);
              }}
              color="white"
              key={cap.lang}
              leftSection={caption?.lang == cap.lang && <IconCheck size="15" />}
            >
              {cap.lang}
            </Menu.Item>
          );
        })}
        <Menu.Divider />
        <Group p="xs" color="white" justify="space-between">
          <Text size="sm" c="white">
            Caption
          </Text>
          <Switch
            size="sm"
            onChange={(ev) => {
              onActiveStateChange(ev.target.checked);
            }}
            checked={active}
          />
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
}
