import { createFormContext } from '@mantine/form';
import { ReactNode, useEffect } from 'react';
import toast from 'react-hot-toast';
import { QuizModel } from '~/features/quiz/quiz.model';
import {
  AddUpdateQuizSubmissionModel,
  AddUpdateQuizSubmissionModelResp,
} from '~/features/quizSubmission/quizSubmission.model';
import { useQuizSubmissionMutations } from '~/features/quizSubmission/use-quizSubmission';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';

export const [
  FormProvider,
  useSubmissionQuizFormContext,
  useSubmissionQuizForm,
] = createFormContext<AddUpdateQuizSubmissionModel>();

export const initialValues: AddUpdateQuizSubmissionModel = {
  quizId: '',
  answers: [],
};

const QuizSubmissionFormProvider = ({
  children,
  quiz,
  onSubmitSuccess,
}: {
  children: ReactNode;
  quiz?: QuizModel;
  onSubmitSuccess?(data?: AddUpdateQuizSubmissionModelResp): void;
}) => {
  const { t: commonT } = useTranslation('common');
  const { addNewQuizSubmission } = useQuizSubmissionMutations();
  const form = useSubmissionQuizForm({
    initialValues,
  });

  const onSubmit = (values: AddUpdateQuizSubmissionModel) => {
    // convert string to number in each item of AnsProvided
    const answers = Object.entries(values.answers).map(([_, value]) => ({
      ...value,
      answerProvided: value.answerProvided.map((ans) => parseInt(`${ans}`)),
    }));

    toast.promise(addNewQuizSubmission({ ...values, answers }), {
      success: (data) => {
        onSubmitSuccess?.(data);
        onReset();
        return data.message;
      },
      error: errorResolver(form),
      loading: commonT('common.loading.submit'),
    });
  };

  const onReset = () => {
    form.setValues({
      quizId: quiz?._id!,
      answers:
        quiz?.questions?.map((q) => ({
          questionId: q._id!,
          answerProvided: [],
        })) || [],
    });
  };

  useEffect(() => {
    if (quiz?.questions?.length! > 0) {
      onReset();
    }
  }, [quiz]);

  return (
    <FormProvider form={form}>
      <form onSubmit={form.onSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

export default QuizSubmissionFormProvider;
