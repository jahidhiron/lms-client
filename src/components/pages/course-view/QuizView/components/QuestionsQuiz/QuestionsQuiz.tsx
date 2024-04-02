import { Stack, Title } from '@mantine/core';
import { QuizModel } from '~/features/quiz/quiz.model';
import QuestionCardQuiz from '../QuestionCardQuiz';

type QuestionsQuizProps = {
  quiz?: QuizModel;
};

export default function QuestionsQuiz({ quiz }: QuestionsQuizProps) {
  return (
    <Stack w="100%">
      <Title order={5} ta="center" c="orange">
        Select Answers to those questions
      </Title>
      {quiz?.questions?.map((ques, index) => (
        <QuestionCardQuiz key={index} questionIndex={index} question={ques} />
      ))}
    </Stack>
  );
}
