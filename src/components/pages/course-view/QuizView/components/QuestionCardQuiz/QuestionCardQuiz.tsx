import {
  Flex,
  Paper,
  Radio,
  Stack,
  TypographyStylesProvider,
} from '@mantine/core';
import { useMemo } from 'react';
import { QuestionModel } from '~/features/quiz/quiz.model';
import { QUESTION_TYPE_TRUE_FALSE } from '~/helpers/constants';
import { useSubmissionQuizFormContext } from '~/libs/providers/QuizSubmittionFormProvider';

type QuestionCardQuizProps = {
  question?: QuestionModel;
  questionIndex: number;
};

export default function QuestionCardQuiz({
  question,
  questionIndex,
}: QuestionCardQuizProps) {
  const form = useSubmissionQuizFormContext();
  const renderOptions = useMemo(() => {
    return question?.options?.map((opt, index) => (
      <Radio w="100%" label={opt.option} key={index} value={`${opt.index}`} />
    ));
  }, [question, form]);
  return (
    <Paper withBorder p="md" w="100%">
      <Radio.Group
        w="100%"
        size="md"
        ta="center"
        name={`answers.${questionIndex}.answerProvided.0`}
        {...form.getInputProps(`answers.${questionIndex}.answerProvided.0`)}
        onChange={(value) => {
          form.setFieldValue(
            `answers.${questionIndex}.answerProvided.0`,
            value
          );
        }}
        label={
          <TypographyStylesProvider p="0" mb="0">
            <div
              dangerouslySetInnerHTML={{ __html: question?.title || '' }}
              style={{ marginBottom: 0 }}
            ></div>
          </TypographyStylesProvider>
        }
      >
        {question?.questionType == QUESTION_TYPE_TRUE_FALSE ? (
          <Flex mt="xs">{renderOptions}</Flex>
        ) : (
          <Stack mt="xs">{renderOptions}</Stack>
        )}
      </Radio.Group>
    </Paper>
  );
}
