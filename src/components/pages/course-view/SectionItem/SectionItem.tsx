import {
  Button,
  Checkbox,
  Flex,
  Group,
  Indicator,
  Menu,
  Paper,
  Text,
} from '@mantine/core';
import {
  IconChevronDown,
  IconLink,
  IconPhotoAi,
  IconPlayerPlay,
  IconVideo,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { AssignmentModel } from '~/features/assignment/assignment.model';
import { useAssignmentSubmission } from '~/features/assignmentSubmission/use-assignmentSubmission';
import { useEnrollment } from '~/features/enrollment/use-enrollment';
import { LectureModel } from '~/features/lecture/lecture.model';
import { QuizModel } from '~/features/quiz/quiz.model';
import { useQuizSubmission } from '~/features/quizSubmission/use-quizSubmission';
import { ASSIGNMENT_SUBMITTED } from '~/helpers/constants';
import { getStaticContentUrl, secondToText } from '~/helpers/utils';
import useVideoPlayerState from '~/libs/store/useVideoPlayerState';
import classes from './SectionItem.module.css';

type SectionItemProps = {
  active?: boolean;
  lecture?: LectureModel;
  quiz?: QuizModel;
  assignment?: AssignmentModel;
  index: number;
};

export default function SectionItem({
  index,
  active,
  lecture,
  quiz,
  assignment,
}: SectionItemProps) {
  const router = useRouter();
  const eId = router.query.eId as string;
  const { enrollment } = useEnrollment({ id: eId });
  const { quizSubmission } = useQuizSubmission({ quizId: quiz?._id! });
  const isPlaying = useVideoPlayerState((state) => state.isPlaying);
  const { assignmentSubmission } = useAssignmentSubmission({
    id: assignment?._id!,
  });
  const isComplete = useMemo(() => {
    if (lecture) {
      return !!enrollment?.complete?.find(
        (lec) => lec.lectureId == lecture?._id
      );
    }
    if (quiz) {
      return quizSubmission?.answer?.length! > 0;
    }
    if (assignmentSubmission) {
      return assignmentSubmission?.status == ASSIGNMENT_SUBMITTED;
    }
  }, [enrollment, lecture, quiz, quizSubmission]);

  return (
    <Indicator
      position="top-start"
      disabled={!active}
      processing={isPlaying}
      label={<IconPlayerPlay size="15" />}
      size={25}
    >
      <Paper className={classes.sectionItem} data-active={active}>
        <Flex gap="xs" w="100%" align="flex-start">
          <Checkbox mt="3" checked={isComplete} onChange={() => {}} />

          <Paper
            component={Link}
            onClick={(ev) => {
              if (active) {
                ev.preventDefault();
              }
            }}
            href={{
              pathname: router.pathname,
              query: {
                ...router.query,
                itemType: lecture
                  ? 'lecture'
                  : quiz
                  ? 'quiz'
                  : assignment
                  ? 'assignment'
                  : undefined,
                itemId: lecture?._id || quiz?._id || assignment?._id,
              },
            }}
            w="100%"
            bg="transparent"
          >
            <Text mt={0} size="sm" c="dark">
              {quiz ? 'Quiz ' : assignment ? 'Assignment ' : ''}
              {index + 1}. {lecture?.title || quiz?.title || assignment?.title}
            </Text>
          </Paper>
        </Flex>
        {lecture && (
          <Group w="100%" pl="lg" align="center" justify="space-between" mt="2">
            <Group gap={5}>
              <IconVideo size="15" color="gray" />
              <Text size="xs" c="dimmed">
                {secondToText(lecture?.video?.timeLength || 0)}
              </Text>
            </Group>
            {(lecture?.resources?.length as number) > 0 && (
              <Menu>
                <Menu.Target>
                  <Button
                    size="xs"
                    leftSection={<IconChevronDown />}
                    variant="outline"
                  >
                    Resources
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {lecture?.resources?.map((res) => (
                    <Menu.Item
                      component={Link}
                      href={getStaticContentUrl(
                        res.file?.path || res?.link || ''
                      )}
                      target="_blank"
                      leftSection={
                        res.file?.mimetype?.includes('image') ? (
                          <IconPhotoAi size="20" />
                        ) : (
                          <IconLink size="20" />
                        )
                      }
                      key={res._id || res.fileId}
                    >
                      {res.title || res.file?.name}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        )}
      </Paper>
    </Indicator>
  );
}
