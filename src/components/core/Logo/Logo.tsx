import { Flex, Title } from '@mantine/core';
import Link from 'next/link';
import classes from './Logo.module.css';

export type LogoProps = {
  mode?: 'dark' | 'white';
};

export default function Logo({ mode = 'dark' }: LogoProps) {
  return (
    <Link href="/" className={classes.logo}>
      <Flex align="center">
        <Title c="orange">Uˆ</Title>
        <Title order={2} td="underline" c={mode}>
          cademy
        </Title>
      </Flex>
    </Link>
  );
}
