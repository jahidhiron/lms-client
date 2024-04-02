import { Button, NavLink, Stack, Title } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { CourseModel } from '~/features/course/course.model';
import { useCourseMutations } from '~/features/course/use-course';
import { COURSE_STATUS_IN_REVIEW } from '~/helpers/constants';
import { courseNavigation } from '~/helpers/route.map';
import { errorResolver } from '~/helpers/utils';
import useTranslation, { CustomTranslate } from '~/hooks/use-translation';
import { useCourseFormContext } from '~/libs/providers/CourseFormProvider';
import classes from './CourseBuilderMenubar.module.css';

type CourseBuilderMenubarProps = {
  course: CourseModel;
};

export default function CourseBuilderMenubar({
  course,
}: CourseBuilderMenubarProps) {
  const router = useRouter();
  const { t: commonT, lang } = useTranslation('common');
  const { updateCourse } = useCourseMutations();
  const form = useCourseFormContext();

  const navigation = useMemo(
    () =>
      courseNavigation(commonT as CustomTranslate, course).map((nav) => (
        <Stack gap="xs" key={nav.title}>
          <Title order={6}>{nav.title}</Title>
          {nav.children?.map((navChild) => (
            <NavLink
              key={navChild.title}
              label={navChild.title}
              component={Link}
              active={router.pathname.endsWith(navChild?.url!)}
              href={`/console/teacher/course/${course?._id}${navChild.url}`}
              leftSection={
                <IconCircleCheck
                  stroke={1.5}
                  color={navChild?.done ? 'orange' : 'gray'}
                />
              }
              className={classes.navLink}
            />
          ))}
        </Stack>
      )),
    [lang, router, course]
  );

  const onSubmitForReview = () => {
    if (!course?.categoryId && !course?.subCategoryId) {
      toast.error('Please select a category');
      return;
    }
    if (course?.whatWillLearn?.length == 0) {
      toast.error('Please add what will learn');
      return;
    }
    if (course?.prerequisites?.length == 0) {
      toast.error('Please add prerequisites');
      return;
    }
    if (course?.whoIsThisCourseFor?.length == 0) {
      toast.error('Please add who is this course for');
      return;
    }
    if (!course?.congratulationsMsg && !course?.welcomeMsg) {
      toast.error('Please add congratulations and welcome message');
      return;
    }
    if ((course?.sections?.length! as number) < 1) {
      toast.error('Please add sections');
      return;
    }
    if (!course?.thumbnailId && !course?.promotionalVideoId) {
      toast.error('Please add thumbnail and promotional video');
      return;
    }

    toast.promise(
      updateCourse(course?._id, {
        ...form.values,
        status: COURSE_STATUS_IN_REVIEW,
      }),
      {
        loading: 'Submitting for review...',
        success: 'Submitted for review successfully',
        error: errorResolver(),
      }
    );
  };

  return (
    <Stack>
      {navigation}
      <Button onClick={onSubmitForReview}>Submit For Review</Button>
    </Stack>
  );
}
