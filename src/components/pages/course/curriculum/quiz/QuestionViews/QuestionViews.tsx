import { CloseButton, Group, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { ReactNode, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  QuestionModel,
  QuestionType,
  QuizModel,
} from '~/features/quiz/quiz.model';
import { useQuizMutations } from '~/features/quiz/use-quiz';
import {
  QUESTION_TYPE_MCQ,
  QUESTION_TYPE_TRUE_FALSE,
} from '~/helpers/constants';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import QuestionListings from '../QuestionListings';
import MultipleChoiceForm from '../questionFormTypes/MultipleChoiceForm';
import TrueFalseForm from '../questionFormTypes/TrueFalseForm';

type QuestionViewsProps = {
  quiz?: QuizModel;
};

type ViewStateType = 'listing' | 'form';

export default function QuestionViews({ quiz }: QuestionViewsProps) {
  const [viewState, setViewState] = useState<ViewStateType>('listing');
  const { updateQuiz } = useQuizMutations();
  const [selectedQuestionType, setSelectedQuestionType] =
    useState<QuestionType>();
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionModel | null>(null);
  const { t: commonT } = useTranslation('common');

  const onAddUpdateQuestion = (question: QuestionModel) => {
    let questions = [...(quiz?.questions || [])];
    const questionIndex = questions.findIndex((q) => q?._id == question?._id);

    if (questionIndex === -1) {
      questions.push(question);
    } else {
      questions[questionIndex] = question;
    }
    console.log(question);

    toast.promise(
      updateQuiz(quiz?._id!, {
        courseId: quiz?.courseId || '',
        desc: quiz?.desc || '',
        questions,
        title: quiz?.title || '',
      }),
      {
        success: (data) => {
          setViewState('listing');
          return data.message;
        },
        error: errorResolver(),
        loading: commonT('common.loading.update', {
          feature: commonT('common.words.quiz'),
        }),
      }
    );
  };

  const onRemoveQuestion = (question: QuestionModel) => {
    modals.openConfirmModal({
      title: commonT('common.labels.remove', {
        feature: commonT('common.words.quiz'),
        title: '',
      }),
      centered: true,
      children: (
        <Text size="sm">
          {commonT('common.labels.remove-message', {
            feature: commonT('common.words.quiz'),
            title: '',
          })}
        </Text>
      ),
      labels: {
        confirm: commonT('common.words.confirm'),
        cancel: commonT('common.words.cancel'),
      },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        let questions = (quiz?.questions || [])?.filter(
          (q) => q?._id !== question._id
        );

        toast.promise(
          updateQuiz(quiz?._id!, {
            courseId: quiz?.courseId || '',
            desc: quiz?.desc || '',
            questions,
            title: quiz?.title || '',
          }),
          {
            success: (data) => {
              setViewState('listing');
              return data.message;
            },
            error: errorResolver(),
            loading: commonT('common.loading.update', {
              feature: commonT('common.words.quiz'),
            }),
          }
        );
      },
    });
  };

  const renderView = useMemo(
    () =>
      ({
        listing: (
          <QuestionListings
            questions={quiz?.questions}
            onAdd={(questionType) => {
              setSelectedQuestion(null);
              setSelectedQuestionType(questionType);
              setViewState('form');
            }}
            onReorder={(items) => {
              toast.promise(
                updateQuiz(quiz?._id!, {
                  courseId: quiz?.courseId || '',
                  desc: quiz?.desc || '',
                  questions: items,
                  title: quiz?.title || '',
                }),
                {
                  success: (data) => {
                    setViewState('listing');
                    return data.message;
                  },
                  error: errorResolver(),
                  loading: commonT('common.loading.update', {
                    feature: commonT('common.words.quiz'),
                  }),
                }
              );
            }}
            onRemove={onRemoveQuestion}
            onEdit={(question) => {
              if (
                JSON.stringify(
                  question.options?.map((opt) => opt.option.toLowerCase())
                ) == JSON.stringify(['true', 'false'])
              ) {
                setSelectedQuestionType(QUESTION_TYPE_TRUE_FALSE);
              } else {
                setSelectedQuestionType(QUESTION_TYPE_MCQ);
              }
              setSelectedQuestion(question);
              setViewState('form');
            }}
          />
        ),
        form: selectedQuestionType ? (
          <>
            <Group justify="flex-end">
              <CloseButton
                onClick={() => {
                  setViewState('listing');
                }}
              />
            </Group>
            {
              {
                [QUESTION_TYPE_TRUE_FALSE]: (
                  <TrueFalseForm
                    question={selectedQuestion}
                    onCancel={() => setViewState('listing')}
                    onSave={onAddUpdateQuestion}
                  />
                ),
                [QUESTION_TYPE_MCQ]: (
                  <MultipleChoiceForm
                    question={selectedQuestion}
                    onCancel={() => setViewState('listing')}
                    onSave={onAddUpdateQuestion}
                  />
                ),
              }[selectedQuestionType]
            }
          </>
        ) : (
          <></>
        ),
      }) as Record<ViewStateType, ReactNode>,
    [quiz, selectedQuestionType, selectedQuestion]
  );

  return <>{renderView[viewState]}</>;
}
