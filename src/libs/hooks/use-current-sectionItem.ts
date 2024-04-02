import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useEnrollment } from '~/features/enrollment/use-enrollment';

const useCurrentNextSectionItem = ({
  eId,
  itemId,
}: {
  itemId: string;
  eId: string;
}) => {
  const router = useRouter();
  const { enrollment } = useEnrollment({ id: eId as string });

  const allLectures = useMemo(
    () => enrollment?.course?.sections?.flatMap((sec) => sec.items) || [],
    [enrollment]
  );

  const { currentItem, nextItem } = useMemo(() => {
    const currentItemIndex = allLectures.findIndex(
      (item) =>
        (item?.lectureId || item?.quizId || item?.assignmentId) === itemId
    );
    if (currentItemIndex == -1) {
      return {};
    }
    const currentItem = allLectures?.at(currentItemIndex);
    const nextItem = allLectures?.at(currentItemIndex + 1);
    return { currentItem, nextItem };
  }, [allLectures, itemId]);
  const isNextItemAvailable = !!nextItem;

  const moveToNextItem = () => {
    if (nextItem) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          itemId:
            (nextItem?.lectureId as string) ||
            (nextItem?.quizId as string) ||
            (nextItem?.assignmentId as string) ||
            '',
          itemType: nextItem?.quiz
            ? 'quiz'
            : nextItem?.lecture
            ? 'lecture'
            : nextItem?.assignment
            ? 'assignment'
            : '',
        },
      });
    }
  };

  return { currentItem, nextItem, moveToNextItem, isNextItemAvailable };
};

export default useCurrentNextSectionItem;
