import { Box, Divider, Paper, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconWorldQuestion } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { QuizModel } from '~/features/quiz/quiz.model';
import { useQuiz, useQuizMutations } from '~/features/quiz/use-quiz';
import { autoUpdateTrigger, errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import { useCourseFormContext } from '~/libs/providers/CourseFormProvider';
import SectionItemPreview from '../../SectionItemPreview';
import QuestionViews from '../QuestionViews';
import QuizInfoForm from '../QuizInfoForm';
import classes from './QuizContainer.module.css';

type QuizContainerProps = {
  sectionIndex: number;
  quizIndex: number;
  quizId?: string;
  quiz?: QuizModel;
};

export type QuizViews = 'description' | 'resources' | 'content';

export default function QuizContainer({
  sectionIndex,
  quizIndex,
  quizId,
}: QuizContainerProps) {
  const router = useRouter();
  const courseId = router.query?.cid as string;
  const { t: commonT } = useTranslation('common');
  const [preview, setPreview] = useState(!!quizId);
  const [collapsed, setCollapsed] = useState(false);
  const { addNewQuiz, updateQuiz, deleteQuiz } = useQuizMutations();
  const { quiz } = useQuiz({ id: quizId! });
  const form = useCourseFormContext();

  return (
    <Paper withBorder bg="white" w="100%" p="md" className={classes.container}>
      {preview ? (
        <SectionItemPreview
          toggleLabel="Questions"
          sectionName="Quiz"
          collapsedState={collapsed}
          onToggleCollapsed={() => setCollapsed(!collapsed)}
          icon={<IconWorldQuestion size="20" />}
          itemIndex={quizIndex}
          onEdit={() => {
            setCollapsed(false);
            setPreview(false);
          }}
          onRemove={() => {
            modals.openConfirmModal({
              title: commonT('common.labels.remove', {
                feature: commonT('common.words.quiz'),
                title: quiz?.title,
              }),
              centered: true,
              children: (
                <Text size="sm">
                  {commonT('common.labels.remove-message', {
                    feature: commonT('common.words.quiz'),
                    title: quiz?.title,
                  })}
                </Text>
              ),
              labels: {
                confirm: commonT('common.words.confirm'),
                cancel: commonT('common.words.cancel'),
              },
              confirmProps: { color: 'red' },
              onConfirm: () => {
                form.setFieldValue(
                  `sections.${sectionIndex}.items`,
                  form.values.sections
                    ?.at(sectionIndex)
                    ?.items?.filter((_, i) => quizIndex != i)
                );

                toast.promise(deleteQuiz(quiz?._id!), {
                  success: (data) => {
                    setPreview(true);
                    return data.message;
                  },
                  error: errorResolver(),
                  loading: commonT('common.loading.delete', {
                    feature: commonT('common.words.quiz'),
                  }),
                });

                autoUpdateTrigger(form);

                // TODO: call a quiz cleanup api endpoint to remove all nested resources from the backend.
              },
            });
          }}
          title={quiz?.title || ''}
        />
      ) : (
        <QuizInfoForm
          title={quiz?.title || ''}
          desc={quiz?.desc || ''}
          onSave={(title, desc) => {
            if (quizId || quiz) {
              toast.promise(
                updateQuiz((quizId || quiz?._id)!, {
                  desc,
                  title,
                  questions: quiz?.questions || [],
                  courseId: quiz?.course?._id || '',
                }),
                {
                  success: (data) => {
                    setPreview(true);
                    return data.message;
                  },
                  error: errorResolver(form),
                  loading: commonT('common.loading.create', {
                    feature: commonT('common.words.quiz'),
                  }),
                }
              );
              return;
            }
            toast.promise(addNewQuiz({ title, desc, courseId }), {
              success: (data) => {
                form.setFieldValue(
                  `sections.${sectionIndex}.items.${quizIndex}.quizId`,
                  data.data?.quiz?._id
                );
                setPreview(true);

                autoUpdateTrigger(form);
                return data.message;
              },
              error: errorResolver(form),
              loading: commonT('common.loading.create', {
                feature: commonT('common.words.quiz'),
              }),
            });
          }}
          onCancel={() => {
            if (!quizId) {
              form.setFieldValue(
                `sections.${sectionIndex}.items`,
                form.values?.sections
                  ?.at(sectionIndex)
                  ?.items?.filter((_, index) => index != quizIndex)
              );
            }
            setPreview(true);
          }}
          quizIndex={quizIndex}
        />
      )}
      <Box mt="xs" hidden={!collapsed}>
        <Divider />
        <QuestionViews quiz={quiz} />
      </Box>
    </Paper>
  );
}
