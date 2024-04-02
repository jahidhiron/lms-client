import { AspectRatio, Box } from '@mantine/core';
import { dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, type ReactNode } from 'react';
import CourseViewLayout from '~/components/layouts/CourseViewLayout';
import AssignmentView from '~/components/pages/course-view/AssignmentView';
import CourseViewContent from '~/components/pages/course-view/CourseViewContent';
import LectureView from '~/components/pages/course-view/LectureView';
import QuizView from '~/components/pages/course-view/QuizView';
import { getEnrollmentAPI } from '~/features/enrollment/enrollment.api';
import { useEnrollment } from '~/features/enrollment/use-enrollment';
import { getLectureAPI } from '~/features/lecture/lecture.api';
import { queryClient } from '~/helpers/config';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { eId, lectureId } = ctx.query;

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['enrollments', eId],
      queryFn: () => getEnrollmentAPI({ id: eId as string }),
    }),

    queryClient.prefetchQuery({
      queryKey: ['lectures', lectureId],
      queryFn: () => getLectureAPI({ id: lectureId as string }),
    }),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

interface LectureViewPageProps {}

export type LectureNoteView = 'idle' | 'button';

const LectureViewPage = () => {
  const router = useRouter();

  const { eId, itemType } = router.query;
  const [noteViewState, setNoteViewState] = useState<LectureNoteView>('idle');
  const { enrollment } = useEnrollment({ id: eId as string });

  return (
    <Box>
      {itemType == 'lecture' ? (
        <AspectRatio ratio={16 / 7}>
          <LectureView setNoteViewState={setNoteViewState} />
        </AspectRatio>
      ) : itemType === 'quiz' ? (
        <QuizView />
      ) : itemType == 'assignment' ? (
        <AssignmentView />
      ) : null}
      <CourseViewContent
        enrollment={enrollment}
        setNoteViewState={setNoteViewState}
        noteViewState={noteViewState}
      />
    </Box>
  );
};

export default LectureViewPage;

const CustomLayout = (page: ReactNode) => {
  return <CourseViewLayout>{page}</CourseViewLayout>;
};

LectureViewPage.getLayout = CustomLayout;
