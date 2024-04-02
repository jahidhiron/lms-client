import { Switch, Tooltip, rem, useMantineTheme } from '@mantine/core';
import { IconPlayerPauseFilled, IconPlayerPlay } from '@tabler/icons-react';

type AutoPlayButtonProps = {
  active: boolean;
  onChange(_active: boolean): void;
};

export default function AutoPlayButton({
  active,
  onChange,
}: AutoPlayButtonProps) {
  const theme = useMantineTheme();
  return (
    <Tooltip refProp="rootRef" label="Auto Play">
      <Switch
        checked={active}
        onChange={(event) => onChange(event.currentTarget.checked)}
        size="sm"
        thumbIcon={
          active ? (
            <IconPlayerPlay
              style={{ width: rem(12), height: rem(12) }}
              color={theme.colors?.orange?.[4]}
              stroke={3}
            />
          ) : (
            <IconPlayerPauseFilled
              style={{ width: rem(12), height: rem(12) }}
              color={theme.colors?.orange?.[4]}
              stroke={3}
            />
          )
        }
      />
    </Tooltip>
  );
}
