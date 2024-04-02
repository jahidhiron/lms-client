import { SimpleGrid } from '@mantine/core';
import EnrollmentCourseCard from '~/components/cards/EnrollmentCourseCard';
import { EnrollmentCourseCardPlaceholder } from '~/components/cards/EnrollmentCourseCard/EnrollmentCourseCard';
import { useEnrollments } from '~/features/enrollment/use-enrollment';

type EnrollmentListProps = {};

export default function EnrollmentList({}: EnrollmentListProps) {
  const { enrollments, isLoading } = useEnrollments({ page: 1 });
  return (
    <div>
      <SimpleGrid cols={4}>
        {isLoading ? (
          <>
            <EnrollmentCourseCardPlaceholder />
            <EnrollmentCourseCardPlaceholder />
            <EnrollmentCourseCardPlaceholder />
            <EnrollmentCourseCardPlaceholder />
          </>
        ) : (
          enrollments?.map((enrollment) => (
            <EnrollmentCourseCard
              key={enrollment._id}
              enrollment={enrollment}
            />
          ))
        )}{' '}
      </SimpleGrid>
    </div>
  );
}
