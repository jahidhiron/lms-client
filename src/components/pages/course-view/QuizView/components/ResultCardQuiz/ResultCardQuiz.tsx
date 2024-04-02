import {
  Alert,
  Paper,
  Radio,
  Stack,
  TypographyStylesProvider,
  useMantineTheme,
} from '@mantine/core';
import { Fragment, useMemo } from 'react';
import { QuizAnswerModel } from '~/features/quizSubmission/quizSubmission.model';

type ResultCardQuizProps = {
  answer?: QuizAnswerModel;
};

export default function ResultCardQuiz({ answer }: ResultCardQuizProps) {
  const theme = useMantineTheme();
  const color = answer?.match ? theme.colors.green[5] : theme.colors.red[5];
  const renderOptions = useMemo(() => {
    return answer?.options?.map((opt, index) => (
      <Fragment key={index}>
        <Radio
          w="100%"
          color={answer.correctAnswer.includes(opt.index) ? 'green' : 'red'}
          c={answer.correctAnswer.includes(opt.index) ? 'green' : 'red'}
          label={opt.option}
          value={`${opt.index}`}
          styles={{}}
        />
        {opt?.explain && (
          <>
            {answer.correctAnswer.includes(opt.index) ? (
              <Alert title="Why Correct" color="green" ta="left">
                {opt.explain}
              </Alert>
            ) : (
              <Alert title="Why Wrong" color="red" ta="left">
                {opt.explain}
              </Alert>
            )}
          </>
        )}
      </Fragment>
    ));
  }, [answer]);
  return (
    <Paper
      withBorder
      style={{
        borderColor: color,
      }}
      p="md"
      w="100%"
    >
      <Radio.Group
        w="100%"
        size="md"
        // c={color}
        ta="center"
        value={answer?.answerProvided?.at(0)?.toString()}
        label={
          <TypographyStylesProvider p="0" mb="0">
            <div
              dangerouslySetInnerHTML={{ __html: answer?.question || '' }}
              style={{ marginBottom: 0 }}
            ></div>
          </TypographyStylesProvider>
        }
      >
        <Stack mt="xs">{renderOptions}</Stack>
      </Radio.Group>
    </Paper>
  );
}
