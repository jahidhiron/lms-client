import {
  ActionIcon,
  AppShell,
  Center,
  CloseButton,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Text,
} from '@mantine/core';
import { useDisclosure, useHeadroom } from '@mantine/hooks';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import CommonFooter from '~/components/footers/CommonFooter';
import CourseViewHeader from '~/components/pages/course-view/CourseViewHeader';
import CourseViewSidebar from '~/components/pages/course-view/CourseViewSidebar';
import { useEnrollment } from '~/features/enrollment/use-enrollment';

type CourseViewLayoutProps = {
  children: ReactNode;
};

const SIDEBAR_WIDTH = 350;

export default function CourseViewLayout({ children }: CourseViewLayoutProps) {
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure(true);
  const { eId } = router.query;
  const { isLoading } = useEnrollment({ id: eId as string });
  const [loading, { open: openLoading, close: closeLoading }] =
    useDisclosure(false);

  const pinned = useHeadroom({ fixedAt: 120 });

  function onRouteChangeStart(evs: string) {
    if (evs.endsWith(router.query.tabId as string)) {
      openLoading();
    }
  }
  function onRouteChangeDone() {
    closeLoading();
  }

  useEffect(() => {
    router.events.on('routeChangeStart', onRouteChangeStart);
    router.events.on('routeChangeComplete', onRouteChangeDone);
    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart);
      router.events.off('routeChangeComplete', onRouteChangeDone);
    };
  }, [router.asPath]);

  return (
    <AppShell
      header={{ height: 60, collapsed: !pinned }}
      aside={{
        width: SIDEBAR_WIDTH,
        breakpoint: 'md',
        collapsed: { desktop: !opened, mobile: !opened },
      }}
      // pos={isLoading || loading ? 'fixed' : 'relative'}
      padding="md"
    >
      <AppShell.Header bg={'dark'} zIndex={100}>
        <CourseViewHeader />
      </AppShell.Header>

      <LoadingOverlay
        loaderProps={{
          type: 'bars',
        }}
        visible={loading || isLoading}
      />
      <AppShell.Main
        pos="relative"
        pl="0"
        pr={opened ? SIDEBAR_WIDTH : 0}
        pt={60}
      >
        {children}
      </AppShell.Main>
      <AppShell.Aside p="md" pb={0}>
        <AppShell.Section>
          {!opened && (
            <Paper withBorder pos="absolute" left={-40} bg="dark" top={0}>
              <Center>
                <ActionIcon
                  variant="transparent"
                  c="white"
                  onClick={toggle}
                  size="lg"
                >
                  <IconArrowLeft />
                </ActionIcon>
              </Center>
            </Paper>
          )}
          <Group justify="space-between">
            <Text size="sm" c="black" fw="bold">
              Course Content
            </Text>
            <CloseButton onClick={toggle} />
          </Group>
          <Divider mt="sm" />
        </AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea}>
          <CourseViewSidebar />
        </AppShell.Section>
      </AppShell.Aside>
      <AppShell.Footer
        pr={opened ? SIDEBAR_WIDTH : 0}
        withBorder={false}
        pos="relative"
      >
        <CommonFooter />
      </AppShell.Footer>
    </AppShell>
  );
}
