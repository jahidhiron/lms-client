import { Button, Group, Modal } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useConfirmLeave = ({ shouldWarn }: { shouldWarn: boolean }) => {
  const router = useRouter();
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [navigationConfig, setNavigationConfig] = useState<{
    nextRoute: string | null;
    isModalOpen: boolean;
  }>({
    nextRoute: null,
    isModalOpen: false,
  });

  // Use beforeunload to prevent closing the tab, refreshing the page or moving outside the Next app
  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!shouldWarn) return;
      e.preventDefault();
      const event = e || window.event;
      return (event.returnValue = 'Are you sure you want to leave?');
    };

    window.addEventListener('beforeunload', handleWindowClose);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, [shouldWarn, router]);

  // Use routeChangeStart to prevent navigation inside of the Next app
  useEffect(() => {
    const onRouteChangeStart = (route: string) => {
      if (!shouldWarn || hasConfirmed) return;
      else {
        setNavigationConfig({
          nextRoute: route,
          isModalOpen: true,
        });
        router.events.emit('routeChangeError');
        throw 'navigation aborted';
      }
    };
    router.events.on('routeChangeStart', onRouteChangeStart);
    const cleanUp = () =>
      router.events.off('routeChangeStart', onRouteChangeStart);

    if (hasConfirmed) {
      if (!navigationConfig.nextRoute) return;
      void router.push(navigationConfig.nextRoute);
      return cleanUp;
    }

    return cleanUp;
  }, [navigationConfig, hasConfirmed, router, shouldWarn]);

  const ConfirmLeaveModal = () => (
    <Modal
      opened={navigationConfig.isModalOpen}
      title={'Are You Sure to Leave this Page?'}
      onClose={() => {
        setNavigationConfig({
          nextRoute: null,
          isModalOpen: false,
        });
      }}
    >
      <Group justify="flex-end">
        <Button
          onClick={() => {
            setNavigationConfig({
              nextRoute: null,
              isModalOpen: false,
            });
          }}
          color="dark"
          variant="outline"
          size="sm"
        >
          Cancel
        </Button>
        <Button onClick={() => setHasConfirmed(true)} color="red" size="sm">
          Leave
        </Button>
      </Group>
    </Modal>
  );

  return {
    ConfirmLeaveModal,
  };
};
