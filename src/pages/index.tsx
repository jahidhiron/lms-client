import { Container, Stack } from '@mantine/core';
import { dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import Banner from '~/components/pages/home/Banner';
import LatestCourses from '~/components/pages/home/LatestCourses';
import TopRatedCourses from '~/components/pages/home/TopRatedCourses';
import { getCoursesAPI } from '~/features/course/course.api';
import { queryClient } from '~/helpers/config';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  await queryClient.prefetchQuery({
    queryKey: [
      'courses',
      1,
      10,
      true,
      null,
      null,
      'rated',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    queryFn: () =>
      getCoursesAPI({
        page: 1,
        size: 10,
        isPublic: true,
        sort: 'rated',
      }),
  });
  await queryClient.prefetchQuery({
    queryKey: [
      'courses',
      1,
      10,
      true,
      null,
      null,
      'latest',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    queryFn: () =>
      getCoursesAPI({
        page: 1,
        size: 10,
        isPublic: true,
        sort: 'latest',
      }),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function IndexPage() {
  return (
    <Container size="xl" py="sm">
      <Banner />
      {/* <PublicCourseCard orientation="horizontal" /> */}
      <Stack mt="sm">
        <LatestCourses />
        <TopRatedCourses />
      </Stack>
    </Container>
  );
}
