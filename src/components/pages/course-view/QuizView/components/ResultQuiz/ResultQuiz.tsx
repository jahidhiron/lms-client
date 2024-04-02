import {
  Box,
  CloseIcon,
  Divider,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useMemo } from 'react';
import { QuizSubmissionModel } from '~/features/quizSubmission/quizSubmission.model';
import { pluralizationFormat } from '~/helpers/utils';
import ResultCardQuiz from '../ResultCardQuiz';

type ResultQuizProps = {
  quizSubmission?: QuizSubmissionModel;
};

export default function ResultQuiz({ quizSubmission }: ResultQuizProps) {
  const allPass =
    quizSubmission?.totalScore == quizSubmission?.totalAcquireScore;
  const totalQuestions = quizSubmission?.answer?.length || 0;
  const { totalPassed, totalFailed } = useMemo(() => {
    let totalPassed = 0;
    let totalFailed = 0;

    quizSubmission?.answer?.forEach((ans) => {
      if (ans.match) totalPassed++;
      else totalFailed++;
    });

    return { totalFailed, totalPassed };
  }, [quizSubmission]);
  return (
    <div>
      <Box>
        <Stack>
          <Group>
            <Box>
              {allPass ? (
                <ThemeIcon
                  color="green"
                  variant="outline"
                  radius="xl"
                  size="xl"
                >
                  <IconCheck />
                </ThemeIcon>
              ) : (
                <ThemeIcon color="red" variant="outline" radius="xl" size="xl">
                  <CloseIcon />
                </ThemeIcon>
              )}
            </Box>
            <Stack gap="xs">
              <Title>Complete the quiz to see your results.</Title>
              <Text>
                You passed {totalPassed}{' '}
                {pluralizationFormat(totalPassed, 'question', 'questions')} out
                of {totalQuestions}{' '}
                {pluralizationFormat(totalQuestions, 'question', 'questions')}.
              </Text>
            </Stack>
          </Group>
          <Divider />

          {quizSubmission?.answer?.map((qs) => (
            <ResultCardQuiz key={qs._id} answer={qs} />
          ))}
        </Stack>
      </Box>
    </div>
  );
}
