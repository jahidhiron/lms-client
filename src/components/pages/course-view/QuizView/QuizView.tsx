import {
  ActionIcon,
  Button,
  Container,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { useFullscreen } from '@mantine/hooks';
import {
  IconArrowForward,
  IconMaximize,
  IconMinimize,
  IconRepeat,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useQuiz } from '~/features/quiz/use-quiz';
import {
  useQuizSubmission,
  useQuizSubmissionMutations,
} from '~/features/quizSubmission/use-quizSubmission';
import { errorResolver } from '~/helpers/utils';
import useCurrentNextSectionItem from '~/hooks/use-current-sectionItem';
import QuizSubmissionFormProvider from '~/libs/providers/QuizSubmittionFormProvider';
import OnBoardQuiz from './components/OnBoardQuiz';
import QuestionsQuiz from './components/QuestionsQuiz';
import ResultQuiz from './components/ResultQuiz';

type QuizViewProps = {};

type QuizViewState = 'onboard' | 'questions' | 'result';

export default function QuizView({}: QuizViewProps) {
  const router = useRouter();
  const eId = router?.query?.eId as string;
  const quizId = router?.query?.itemId as string;
  const { quiz } = useQuiz({ id: quizId });
  const { retryQuizSubmission } = useQuizSubmissionMutations();
  const { quizSubmission } = useQuizSubmission({ quizId: quizId });
  const [viewState, setViewState] = useState<QuizViewState>('onboard');
  const { moveToNextItem } = useCurrentNextSectionItem({
    itemId: quizId,
    eId,
  });
  const { ref, fullscreen, toggle } = useFullscreen();

  const renderView = useMemo(() => {
    switch (viewState) {
      case 'onboard':
        return (
          <OnBoardQuiz
            onSkip={moveToNextItem}
            onStart={() => {
              setViewState('questions');
            }}
            quiz={quiz}
          />
        );
      case 'questions':
        return <QuestionsQuiz quiz={quiz} />;

      case 'result':
        return <ResultQuiz quizSubmission={quizSubmission} />;
      default:
        return <></>;
    }
  }, [viewState, quiz, quizSubmission?.answer]);

  const renderButton = useMemo(() => {
    switch (viewState) {
      case 'onboard':
        return <></>;
      case 'questions':
        return (
          <Button size="xs" type="submit">
            Submit
          </Button>
        );

      case 'result':
        return (
          <>
            <Button
              variant="outline"
              leftSection={<IconRepeat />}
              size="xs"
              onClick={() => {
                toast
                  .promise(retryQuizSubmission({ quizId }), {
                    success: (data) => data.message,
                    error: errorResolver(),
                    loading: '...',
                  })
                  .finally(() => {
                    setViewState('onboard');
                  });
              }}
            >
              Retry
            </Button>
            <Button
              size="xs"
              rightSection={<IconArrowForward />}
              onClick={moveToNextItem}
            >
              Next
            </Button>
          </>
        );
      default:
        return <></>;
    }
  }, [viewState, quiz, quizSubmission?.answer]);

  useEffect(() => {
    if ((quizSubmission?.answer?.length as number) > 0) {
      setViewState('result');
    } else if (quizSubmission && quizSubmission?.answer?.length == 0) {
      setViewState('onboard');
    }
  }, [quizSubmission?.answer]);

  return (
    <QuizSubmissionFormProvider
      quiz={quiz}
      onSubmitSuccess={() => {
        setViewState('result');
      }}
    >
      <Stack ref={ref} bg="white" p="xs" pos="relative" h="400">
        <ScrollArea w="100%">
          <Container
            mt="xl"
            size={'sm'}
            h={!fullscreen ? 290 : '87vh'}
            w="100%"
          >
            {renderView}
          </Container>
        </ScrollArea>
        <Paper p="5" w="100%" bottom="0" withBorder>
          <Group justify="space-between">
            <Text></Text>
            <Group>
              {renderButton}
              <ActionIcon onClick={toggle} color="dark" variant="transparent">
                {fullscreen ? <IconMinimize /> : <IconMaximize />}
              </ActionIcon>
            </Group>
          </Group>
        </Paper>
      </Stack>
    </QuizSubmissionFormProvider>
  );
}
