import { ActionIcon, Tooltip } from '@mantine/core';
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from '@tabler/icons-react';

type PlayPauseButtonProps = {
  isPlaying: boolean;
  onToggle(_playing: boolean): void;
};

export default function PlayPauseButton({
  onToggle,
  isPlaying,
}: PlayPauseButtonProps) {
  if (isPlaying) {
    return (
      <Tooltip withinPortal={false} label="Pause" fz="xs">
        <ActionIcon variant="light" onClick={() => onToggle(true)}>
          <IconPlayerPauseFilled stroke={1} />
        </ActionIcon>
      </Tooltip>
    );
  }

  return (
    <Tooltip withinPortal={false} label="Play" fz="xs">
      <ActionIcon variant="light" onClick={() => onToggle(false)}>
        <IconPlayerPlayFilled stroke={1} />
      </ActionIcon>
    </Tooltip>
  );
}
