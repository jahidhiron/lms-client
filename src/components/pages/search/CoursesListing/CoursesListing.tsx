import { Divider, Stack } from '@mantine/core';
import React from 'react';
import PublicCourseCard from '~/components/cards/PublicCourseCard';
import { CourseModel } from '~/features/course/course.model';

type CoursesListingProps = {
  courses: CourseModel[];
};

export default function CoursesListing({ courses }: CoursesListingProps) {
  return (
    <Stack px="sm">
      {courses?.map((course, index) => (
        <React.Fragment key={course?._id}>
          <PublicCourseCard orientation="horizontal" course={course} />
          <Divider hidden={index == courses?.length - 1} />
        </React.Fragment>
      ))}
    </Stack>
  );
}
