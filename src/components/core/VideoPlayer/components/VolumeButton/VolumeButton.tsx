import { ActionIcon, Group, Popover, Slider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconVolumeOff,
} from '@tabler/icons-react';

type VolumeButtonProps = {
  onChange(_volume: number): void;
  volume: number;
};

export default function VolumeButton({ volume, onChange }: VolumeButtonProps) {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <Popover
      position="top"
      withArrow
      onClose={close}
      shadow="md"
      opened={opened}
      withinPortal={false}
      offset={0}
    >
      <Popover.Target>
        <ActionIcon
          onClick={() => {
            if (volume > 0) {
              onChange(0);
            } else {
              onChange(1);
            }
          }}
          onMouseEnter={open}
          onMouseLeave={close}
          variant="light"
        >
          {volume == 0 ? (
            <IconVolumeOff stroke={1} />
          ) : volume > 0.5 ? (
            <IconVolume stroke={1} />
          ) : (
            <IconVolume2 stroke={1} />
          )}
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown onMouseLeave={close} onMouseEnter={open} bg="dark">
        <Group>
          <ActionIcon
            onClick={() => {
              onChange(0);
            }}
            variant="transparent"
          >
            <IconVolume3 stroke={1} />
          </ActionIcon>
          <Slider
            w={100}
            min={0}
            max={1}
            step={0.01}
            value={volume}
            label={`${Math.ceil(volume * 100)}`}
            onChange={onChange}
          />
          <ActionIcon
            onClick={() => {
              onChange(1);
            }}
            variant="transparent"
          >
            <IconVolume stroke={1} />
          </ActionIcon>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
}
