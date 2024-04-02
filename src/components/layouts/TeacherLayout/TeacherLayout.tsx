import { AppShell, Burger, Flex, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useMemo } from 'react';
import LangSwitcher from '~/components/core/LangSwitcher';
import Logo from '~/components/core/Logo';
import NavLinkList from '~/components/core/NavLinkList';
import UserButton from '~/components/core/UserButton';
import useAuth from '~/features/auth/use-auth';
import { ROLE_TEACHER } from '~/helpers/constants';
import { navigation } from '~/helpers/route.map';
import useTranslation, { CustomTranslate } from '~/hooks/use-translation';

type TeacherLayoutProps = {
  children: ReactNode;
};

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  const router = useRouter();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { session } = useAuth();
  const { t: commonT, lang } = useTranslation('common');
  const routes = useMemo(
    () => navigation(commonT as CustomTranslate)[ROLE_TEACHER],
    [lang]
  );

  useEffect(() => {
    if (session?.role !== ROLE_TEACHER) {
      router.replace('/');
    }
  }, [session]);

  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Flex h="100%" px="md" align="center" gap="xs">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
          <Logo />
          <Flex w="100%" justify="flex-end" align="center" gap="xs">
            <UserButton />
            <LangSwitcher />
          </Flex>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Stack gap="xs">
          <NavLinkList navList={routes} />
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
