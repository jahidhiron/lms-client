import { Button, Menu, Tooltip } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

type PlaybackSpeedButtonProps = {
  playbackRate: number;
  onPlaybackRateChange(_number: number): void;
};

export default function PlaybackSpeedButton({
  playbackRate,
  onPlaybackRateChange,
}: PlaybackSpeedButtonProps) {
  const rates = [
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: '1x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.75, label: '0.75x' },
    { value: 2, label: '2x' },
  ];

  return (
    <Menu withinPortal={false} loop position="top-start">
      <Menu.Target>
        <Tooltip withinPortal={false} label="Playback Speed" fz="xs">
          <Button miw="50" size="compact-xs" variant="filled">
            {playbackRate}x
          </Button>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown c="white" bg="dark">
        {rates.map((rate) => (
          <Menu.Item
            key={rate.label}
            color="white"
            onClick={() => onPlaybackRateChange(rate.value)}
            leftSection={playbackRate == rate.value && <IconCheck size="15" />}
          >
            {rate.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
