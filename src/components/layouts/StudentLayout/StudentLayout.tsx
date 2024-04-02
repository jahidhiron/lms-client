import { AppShell } from '@mantine/core';
import { ReactNode } from 'react';
import CommonFooter from '~/components/footers/CommonFooter';
import CommonHeader from '~/components/headers/CommonHeader';

type StudentLayoutProps = {
  children: ReactNode;
};

export default function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <AppShell header={{ height: 80 }} padding="md">
      <AppShell.Header>
        <CommonHeader toggle={() => {}} opened={false} />
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
      <AppShell.Footer withBorder={false} pos="relative">
        <CommonFooter />
      </AppShell.Footer>
    </AppShell>
  );
}
