import { AppShell, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode } from 'react';
import CommonFooter from '~/components/footers/CommonFooter';
import CommonHeader from '~/components/headers/CommonHeader';
import { PAGE_HEADER_HEIGHT } from '~/helpers/constants';
import classes from './CommonLayout.module.css';

type CommonLayoutProps = {
  children: ReactNode;
  headerSticky?: boolean;
};

function CommonLayout({ children, headerSticky = true }: CommonLayoutProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: PAGE_HEADER_HEIGHT, collapsed: !headerSticky }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header zIndex={100} h={80}>
        <CommonHeader opened={opened} toggle={toggle} />
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <UnstyledButton className={classes.control}>Home</UnstyledButton>
        <UnstyledButton className={classes.control}>Blog</UnstyledButton>
        <UnstyledButton className={classes.control}>Contacts</UnstyledButton>
        <UnstyledButton className={classes.control}>Support</UnstyledButton>
      </AppShell.Navbar>

      <AppShell.Main px={0}>{children}</AppShell.Main>
      <AppShell.Footer pos={'relative'} zIndex={10} withBorder={false}>
        <CommonFooter />
      </AppShell.Footer>
    </AppShell>
  );
}
export default CommonLayout;
