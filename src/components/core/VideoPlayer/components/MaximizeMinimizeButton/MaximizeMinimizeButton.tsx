import { ActionIcon, Tooltip } from '@mantine/core';
import { IconMaximize, IconMinimize } from '@tabler/icons-react';

type MaximizeMinimizeButtonProps = {
  isFullscreen: boolean;
  onMaximize(): void;
  onMinimize(): void;
};

export default function MaximizeMinimizeButton({
  isFullscreen,
  onMaximize,
  onMinimize,
}: MaximizeMinimizeButtonProps) {
  if (isFullscreen) {
    return (
      <Tooltip label="Minimize" fz="xs">
        <ActionIcon onClick={onMinimize} variant="light">
          <IconMinimize stroke={1} />
        </ActionIcon>
      </Tooltip>
    );
  }
  return (
    <Tooltip label="Maximize" fz="xs">
      <ActionIcon onClick={onMaximize} variant="light">
        <IconMaximize stroke={1} />
      </ActionIcon>
    </Tooltip>
  );
}
