import { Divider, Group, Title } from '@mantine/core';
import { ReactNode, useState } from 'react';
import { useCourses } from '~/features/course/use-course';

type CourseEditPageHeaderProps = {
  title: string;
  rightSection?: ReactNode;
};
type CourseListModel = { value: string; label: string };

export default function CourseEditPageHeader({
  title,
  rightSection,
}: CourseEditPageHeaderProps) {
  const [data, setData] = useState<CourseListModel[]>([
    { value: 'all', label: 'All Course' },
    { value: 'react-id', label: 'React' },
  ]);

  const { courses } = useCourses({ page: 1, size: 999 });

  // useEffect(() => {
  //   if (courses.length > 0) {
  //     for (const course of courses) {
  //       setData((prev) => [
  //         ...prev,
  //         { value: course._id, label: course.title },
  //       ]);
  //     }
  //   }
  // }, [courses]);
  return (
    <>
      <Group py="md" justify="space-between" align="center">
        <Title order={3}>{title}</Title>
        {rightSection}
      </Group>
      <Divider />
    </>
  );
}
