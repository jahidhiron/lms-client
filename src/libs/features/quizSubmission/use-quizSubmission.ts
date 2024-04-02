import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import {
  addQuizSubmissionAPI,
  deleteQuizSubmissionAPI,
  getQuizSubmissionAPI,
  getQuizSubmissionsAPI,
  updateQuizSubmissionAPI,
} from './quizSubmission.api';
import {
  AddUpdateQuizSubmissionModel,
  GetQuizSubmissionProps,
  ListQuizSubmissionsProps,
} from './quizSubmission.model';

const QUERY_KEY = 'quizSubmissions';

export const useQuizSubmissions = ({
  page = 1,
  size = 10,
}: ListQuizSubmissionsProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, page, size],
    queryFn: ({ queryKey }) =>
      getQuizSubmissionsAPI({
        page: queryKey.at(1) as number,
        size: queryKey.at(2) as number,
      }),
  });

  const quizSubmissions = useMemo(
    () => ({
      quizSubmissions: data?.data?.quizSubmissions || [],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_quizSubmissions: data?.data?.totalItem || 0,
    }),
    [data, page]
  );

  return { ...quizSubmissions, ...others };
};

export const useQuizSubmission = ({ quizId }: GetQuizSubmissionProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, quizId],
    queryFn: () => getQuizSubmissionAPI({ quizId }),
    enabled: !!quizId,
  });

  const quizSubmission = useMemo(() => data?.data?.quizAnswer, [data]);

  return { quizSubmission, ...others };
};

export const useQuizSubmissionMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const addQuizSubmissionMutation = useMutation({
    mutationFn: (data: AddUpdateQuizSubmissionModel) =>
      addQuizSubmissionAPI(data),
    onSuccess(_, vars) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, vars.quizId] });
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addNewQuizSubmission = async (data: AddUpdateQuizSubmissionModel) => {
    return addQuizSubmissionMutation.mutateAsync(data);
  };

  const updateQuizSubmissionMutation = useMutation({
    mutationFn: (vars: never[]) => updateQuizSubmissionAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.setQueryData([QUERY_KEY, variables[0]], data);
    },
  });
  const updateQuizSubmission = async (
    id: string,
    data: AddUpdateQuizSubmissionModel
  ) => {
    return updateQuizSubmissionMutation.mutateAsync([
      id as never,
      data as never,
    ]);
  };

  const deleteQuizSubmissionMutation = useMutation({
    mutationFn: (id: string) => deleteQuizSubmissionAPI(id),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteQuizSubmission = async (id: string) => {
    return deleteQuizSubmissionMutation.mutateAsync(id);
  };

  const retryQuizSubmission = async ({ quizId }: { quizId: string }) => {
    return await addNewQuizSubmission({ quizId, answers: [] });
  };

  return {
    addNewQuizSubmission,
    updateQuizSubmission,
    deleteQuizSubmission,
    retryQuizSubmission,
  };
};
