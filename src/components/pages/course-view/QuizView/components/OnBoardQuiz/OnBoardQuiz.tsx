import { Button, Group, Text, Title } from '@mantine/core';
import { QuizModel } from '~/features/quiz/quiz.model';
import { pluralizationFormat } from '~/helpers/utils';

type OnBoardQuizProps = {
  quiz?: QuizModel;
  onStart(): void;
  onSkip(): void;
};

export default function OnBoardQuiz({
  quiz,
  onSkip,
  onStart,
}: OnBoardQuizProps) {
  return (
    <>
      <Title>{quiz?.title}</Title>
      <Text size="sm">
        {quiz?.questions?.length}{' '}
        {pluralizationFormat(
          quiz?.questions?.length || 0,
          'Question',
          'Questions'
        )}
      </Text>
      <Text>{quiz?.desc}</Text>
      <Group mt="lg">
        <Button onClick={onStart} size="xs">
          Start Quiz
        </Button>
        <Button onClick={onSkip} size="xs" variant="outline" color="dark">
          Skip Quiz
        </Button>
      </Group>
    </>
  );
}
