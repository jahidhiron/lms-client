import '@mantine/carousel/styles.css';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/nprogress/styles.css';
import '@mantine/tiptap/styles.css';
import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import AuthLayout from '~/components/layouts/AuthLayout';
import CommonLayout from '~/components/layouts/CommonLayout';
import CourseCreationLayout from '~/components/layouts/CourseCreationLayout';
import StudentLayout from '~/components/layouts/StudentLayout';
import TeacherLayout from '~/components/layouts/TeacherLayout';
import { RouteProgressbar } from '~/components/utils/RouteProgressbar';
import { queryClient } from '~/helpers/config';
import { route } from '~/helpers/route.map';
import AuthProvider from '~/libs/providers/AuthProvider';
import { theme } from '../../theme';

export default function App({ Component, pageProps }: any) {
  const router = useRouter();

  const getLayout =
    Component.getLayout ||
    ((page: ReactNode) => {
      if (router.pathname.includes(route.auth.pathname)) {
        return <AuthLayout>{page}</AuthLayout>;
      }

      if (router.pathname.startsWith('/console/teacher/course/[cid]/manage')) {
        return <CourseCreationLayout>{page}</CourseCreationLayout>;
      }
      if (router.pathname.includes('/console/teacher')) {
        return <TeacherLayout>{page}</TeacherLayout>;
      }
      if (router.pathname.includes('/console/student')) {
        return <StudentLayout>{page}</StudentLayout>;
      }
      return <CommonLayout>{page}</CommonLayout>;
    });

  return (
    <>
      <Head>
        <title>UAcademy</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <MantineProvider
            theme={{
              ...theme,
              components: {
                Button: {
                  // defaultProps: { disabled: true },
                },
                ActionIcon: {
                  // defaultProps: { disabled: true },
                },
              },
            }}
          >
            <ModalsProvider>
              <Toaster />
              <RouteProgressbar />
              {process.env.NODE_ENV == 'development' && <ReactQueryDevtools />}
              <AuthProvider>
                {getLayout(<Component {...pageProps} />)}
              </AuthProvider>
            </ModalsProvider>
          </MantineProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </>
  );
}
