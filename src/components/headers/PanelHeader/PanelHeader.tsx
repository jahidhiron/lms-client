import { Box, Stack, Title } from '@mantine/core';
import { ReactNode } from 'react';
import classes from './PanelHeader.module.css';
type PanelHeaderProps = {
  title: string;
  downSection?: ReactNode;
};

export default function PanelHeader({ title, downSection }: PanelHeaderProps) {
  return (
    <Stack>
      <Title className={classes.title}>{title}</Title>
      <Box>{downSection}</Box>
    </Stack>
  );
}
