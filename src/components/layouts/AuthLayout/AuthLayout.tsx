import { Box, Paper } from '@mantine/core';
import { ReactNode } from 'react';
import RouteTransitions from '~/components/utils/RouteTransitions';
import { FADE_IN_RTL } from '~/helpers/animations';
import classes from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.formContainer} radius={0} p={30}>
        <RouteTransitions animation={FADE_IN_RTL}>
          <Box w="100%">{children}</Box>
        </RouteTransitions>
      </Paper>
    </div>
  );
}
