import { Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { ReactNode } from 'react';
import classes from './SelectButton.module.css';

type SelectButtonProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
};

export default function SelectButton({
  icon,
  title,
  description,
  selected,
  onPress,
  disabled,
}: SelectButtonProps) {
  return (
    <UnstyledButton
      onClick={onPress}
      className={classes.select_card}
      data-selected={selected}
      data-disabled={disabled}
      disabled={disabled}
    >
      <Stack align="center">
        {icon}
        <Title order={5}>{title}</Title>
        <Text size="xs">{description}</Text>
      </Stack>
    </UnstyledButton>
  );
}
