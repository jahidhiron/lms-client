import { modals } from '@mantine/modals';
import { NavigationProgress, nprogress } from '@mantine/nprogress';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function RouteProgressbar() {
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url: string) => {
      if (url !== router.asPath && !url.includes('/search')) {
        nprogress.start();
      }
    };

    const handleComplete = () => {
      modals.closeAll();
      nprogress.complete();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router.asPath, router.events]);

  return <NavigationProgress />;
}
