import { Title } from '@mantine/core';
import PublicCourseCard from '~/components/cards/PublicCourseCard';
import CarouselCards from '~/components/utils/CarouselCards';
import { useCourses } from '~/features/course/use-course';

type TopRatedCoursesProps = {};

export default function TopRatedCourses({}: TopRatedCoursesProps) {
  const { courses } = useCourses({
    page: 1,
    size: 10,
    sort: 'rated',
    isPublic: true,
  });

  return (
    <CarouselCards title={<Title order={3}>Top Rated Courses</Title>}>
      {courses?.map((course) => (
        <PublicCourseCard key={course?._id} course={course} />
      ))}
    </CarouselCards>
  );
}
