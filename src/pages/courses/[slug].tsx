import { AppShell, Box, Container, Grid, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ReactNode, useMemo } from 'react';
import VideoPreviewPlaylist from '~/components/dialogs/VideoPreviewPlaylist';
import CommonFooter from '~/components/footers/CommonFooter';
import CommonHeader from '~/components/headers/CommonHeader';
import CourseContentListing from '~/components/pages/course-details/CourseContentListing';
import CourseDescription from '~/components/pages/course-details/CourseDescription';
import CourseInfoContainer from '~/components/pages/course-details/CourseInfoContainer';
import CourseInstructorInfo from '~/components/pages/course-details/CourseInstructorInfo';
import CourseIntroView from '~/components/pages/course-details/CourseIntroView';
import CoursePricingCard from '~/components/pages/course-details/CoursePricingCard';
import WhatWillLearn from '~/components/pages/course-details/WhatWillLearn';
import { getCourseAPI } from '~/features/course/course.api';
import { useCourse } from '~/features/course/use-course';
import { FileModel } from '~/features/file/file.model';
import { LectureModel } from '~/features/lecture/lecture.model';
import { getStaticContentUrl } from '~/helpers/utils';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug } = query;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['courses', slug, true],
    queryFn: () => getCourseAPI({ id: slug as string, isPublic: true }),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const CourseDetailsPage = () => {
  const router = useRouter();
  const slug = router.query?.slug as string;
  const [previewed, { close: previewClose, open: previewOpen }] =
    useDisclosure(false);
  const { course } = useCourse({ id: slug, isPublic: true });
  const previewLectures = useMemo(
    () => [
      {
        url: getStaticContentUrl(
          (course?.promotionalVideoId as FileModel)?.path
        ),
        timeLength: (course?.promotionalVideoId as FileModel)?.timeLength,
        title: 'Intro Video',
      },
      ...(course?.sections
        .flatMap((section) => section.items)
        .map((item) => {
          const lecture = item.lectureId as LectureModel;
          return lecture.preview
            ? {
                url: getStaticContentUrl((lecture?.videoId as FileModel).path),
                timeLength: (lecture?.videoId as FileModel)?.timeLength,
                title: lecture?.title,
              }
            : null;
        })
        .filter((url) => url != null) || []),
    ],
    []
  );
  return (
    <>
      <VideoPreviewPlaylist
        list={previewLectures}
        onClose={previewClose}
        opened={previewed}
      />
      <Box bg="dark">
        <Container size="lg" py="xl">
          <Grid>
            <Grid.Col span={{ sm: 12, md: 8 }} order={{ base: 2, md: 1 }}>
              <CourseInfoContainer course={course} />
            </Grid.Col>
            <Grid.Col span={{ sm: 12, md: 4 }} order={{ base: 1, md: 2 }}>
              <CourseIntroView openPreview={previewOpen} course={course} />
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
      <Container size="lg" py="xl">
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }} order={{ base: 2, md: 1 }}>
            <Stack gap="xl">
              {(course?.whatWillLearn?.length as number) > 0 ? (
                <WhatWillLearn whatWillLearn={course?.whatWillLearn || []} />
              ) : null}
              <CourseContentListing openPreview={previewOpen} course={course} />
              <CourseDescription
                perquisites={course?.prerequisites || []}
                whosCourseThis={course?.whoIsThisCourseFor || []}
                desc={course?.desc}
              />
              <CourseInstructorInfo />
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }} order={{ base: 1, md: 2 }}>
            <Box pos="sticky" top={0}>
              <CoursePricingCard course={course} />
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
};

export default CourseDetailsPage;

function CustomLayoutForDetailsPage(page: ReactNode) {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell header={{ height: 80 }}>
      <AppShell.Header h={80}>
        <CommonHeader opened={opened} toggle={toggle} />
      </AppShell.Header>
      <AppShell.Main>{page}</AppShell.Main>
      <AppShell.Footer pos="relative" zIndex={10} withBorder={false}>
        <CommonFooter />
      </AppShell.Footer>
    </AppShell>
  );
}

CourseDetailsPage.getLayout = CustomLayoutForDetailsPage;
