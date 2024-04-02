import { Box, Container, Grid, LoadingOverlay, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CoursesListing from '~/components/pages/search/CoursesListing';
import FilterBar from '~/components/pages/search/FilterBar';
import { getCoursesAPI } from '~/features/course/course.api';
import { useCourses } from '~/features/course/use-course';
import { queryClient } from '~/helpers/config';
import { numberFormat, pluralizationFormat } from '~/helpers/utils';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    categoryId = '',
    subCategoryId = '',
    level = '',
    rating = '',
    duration = '',
    quiz = '',
    assignment = '',
    subtitle = '',
    sort = '',
    price = '',
    page = '1',
    size = '10',
    q = '',
  } = ctx.query as Record<string, string>;

  const paid = String(price == 'paid');

  await queryClient.prefetchQuery({
    queryKey: [
      'courses',
      parseInt(page),
      parseInt(size),
      true,
      subtitle,
      subCategoryId,
      sort,
      rating,
      quiz,
      q,
      assignment,
      categoryId,
      duration,
      level,
      paid,
    ],
    queryFn: () =>
      getCoursesAPI({
        page: parseInt(page),
        size: parseInt(size),
        q,
        isPublic: true,
        categoryId,
        subCategoryId,
        level,
        rating,
        duration,
        quiz,
        assignment,
        subtitle,
        sort,
        paid,
      }),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const SearchPage = () => {
  const [searchLoading, { open: startLoading, close: closeLoading }] =
    useDisclosure(false);
  const router = useRouter();
  const page = parseInt(router.query?.page as string) || 1;
  const size = parseInt(router.query?.size as string) || 10;
  const {
    categoryId = '',
    subCategoryId = '',
    level = '',
    rating = '',
    duration = '',
    quiz = '',
    assignment = '',
    subtitle = '',
    sort = '',
    price = '',
    q = '',
  } = router.query as Record<string, string>;

  const paid = String(price == 'paid');

  const { courses, total_courses, filters } = useCourses({
    page: page,
    size,
    q,
    isPublic: true,
    categoryId,
    subCategoryId,
    level,
    rating,
    duration,
    quiz,
    assignment,
    subtitle,
    sort,
    paid,
  });

  const queryString = router.query?.q as string;

  function onSearchFilterChangeStart() {
    startLoading();
  }
  function onSearchFilterChangeComplete() {
    closeLoading();
  }

  useEffect(() => {
    router.events.on('routeChangeStart', onSearchFilterChangeStart);
    router.events.on('routeChangeComplete', onSearchFilterChangeComplete);
    return () => {
      router.events.off('routeChangeStart', onSearchFilterChangeStart);
      router.events.off('routeChangeComplete', onSearchFilterChangeStart);
    };
  }, []);

  return (
    <Container size="xl" pt="lg">
      <Title order={2}>
        {numberFormat(total_courses)}{' '}
        {pluralizationFormat(total_courses, 'result', 'results')} for &quot;
        {queryString}&quot;
      </Title>
      <Grid mt="lg">
        <Grid.Col span={{ base: 0, md: 3 }}>
          <Box pos="relative">
            <LoadingOverlay
              visible={searchLoading}
              zIndex={1000}
              overlayProps={{ radius: 'sm', blur: 2 }}
            />
            <FilterBar filters={filters!} />
          </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Box pos="relative">
            <LoadingOverlay
              loaderProps={{ type: 'bars' }}
              visible={searchLoading}
              zIndex={1000}
              overlayProps={{ radius: 'sm', blur: 2 }}
            />
            <CoursesListing courses={courses} />
          </Box>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default SearchPage;
