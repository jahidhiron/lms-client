import { Box, Container, Grid, LoadingOverlay, Paper } from '@mantine/core';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useMemo } from 'react';
import { BaseItem } from '~/components/core/SortableList/SortableList';
import CourseEditLayoutHeader from '~/components/headers/CourseEditLayoutHeader';
import CourseBuilderMenubar from '~/components/pages/course/CourseBuilderMenubar';
import { UpdateCourseModel } from '~/features/course/course.model';
import { useCourse } from '~/features/course/use-course';
import CourseFormProvider, {
  initialValues,
} from '~/libs/providers/CourseFormProvider';
import classes from './CourseCreationLayout.module.css';

type CourseCreationLayoutProps = {
  children: ReactNode;
};

function generateEmptyBaseItem(num: number) {
  if (num < 0) return [];
  return Array(num)
    .fill(0)
    .map((_) => ({
      id: nanoid(),
      value: '',
    })) as BaseItem[];
}

export default function CourseCreationLayout({
  children,
}: CourseCreationLayoutProps) {
  const router = useRouter();
  const courseId = router.query?.cid as string;
  const { course: _course, error, isLoading } = useCourse({ id: courseId });

  const course = useMemo(() => {
    if (!_course) return null;

    return {
      prerequisites:
        _course?.prerequisites?.length < 4
          ? [
              ...(_course?.prerequisites?.map((pre) => ({
                id: nanoid(),
                value: pre,
              })) as BaseItem[]),
              ...generateEmptyBaseItem(4 - _course?.prerequisites?.length),
            ]
          : (_course?.prerequisites?.map((pre) => ({
              id: nanoid(),
              value: pre,
            })) as BaseItem[]),

      whoIsThisCourseFor:
        _course?.whoIsThisCourseFor?.length < 4
          ? [
              ...(_course?.whoIsThisCourseFor?.map((pre) => ({
                id: nanoid(),
                value: pre,
              })) as BaseItem[]),
              ...generateEmptyBaseItem(4 - _course?.whoIsThisCourseFor?.length),
            ]
          : (_course?.whoIsThisCourseFor?.map((wtc) => ({
              id: nanoid(),
              value: wtc,
            })) as BaseItem[]),

      whatWillLearn:
        _course?.whatWillLearn?.length < 4
          ? [
              ...(_course?.whatWillLearn?.map((pre) => ({
                id: nanoid(),
                value: pre,
              })) as BaseItem[]),
              ...generateEmptyBaseItem(4 - _course?.whatWillLearn?.length),
            ]
          : (_course?.whatWillLearn?.map((wtc) => ({
              id: nanoid(),
              value: wtc,
            })) as BaseItem[]),

      sections:
        _course?.sections?.length <= 0
          ? initialValues?.sections
          : _course?.sections?.map((sec) => ({ ...sec, rowId: nanoid() })),
      welcomeMsg: _course?.welcomeMsg || '',
      title: _course?.title || '',
      thumbnailId: _course?.thumbnailId,
      promotionalVideoId: _course?.promotionalVideoId,
      subTitle: _course?.subTitle || '',
      subCategoryId: _course?.subCategory?._id,
      categoryId: _course?.category?._id,
      price: _course?.price,
      level: _course?.level || '',
      language: _course?.language || '',
      desc: _course?.desc || '',
      congratulationsMsg: _course?.congratulationsMsg || '',
    } as UpdateCourseModel;
  }, [_course]);

  useEffect(() => {
    // @ts-ignore
    if (error?.response?.data?.id) {
      router.replace('/');
    }
  }, [_course, isLoading, error]);

  return (
    <CourseFormProvider course={course}>
      <Box className={classes.wrapper} data-noscroll={isLoading}>
        <CourseEditLayoutHeader title={course?.title} />
        <Container size={'xl'}>
          <Grid p="xs" py="xl" w="100%">
            <Grid.Col span={2}>
              <CourseBuilderMenubar course={_course!} />
            </Grid.Col>
            <Grid.Col span={10} px="xl" pos="relative">
              <Paper w="100%" withBorder p="sm">
                {children}
              </Paper>
            </Grid.Col>
          </Grid>
        </Container>
        <LoadingOverlay visible={isLoading} loaderProps={{ type: 'dots' }} />
      </Box>
    </CourseFormProvider>
  );
}
