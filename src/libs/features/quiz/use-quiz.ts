import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import {
  addQuizAPI,
  deleteQuizAPI,
  getQuizAPI,
  getQuizzesAPI,
  updateQuizAPI,
} from './quiz.api';
import {
  AddQuizModel,
  GetQuizProps,
  ListQuizzesProps,
  UpdateQuizModel,
} from './quiz.model';

const QUERY_KEY = 'quizzes';

export const useQuizzes = ({ page = 1, size = 10 }: ListQuizzesProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, page, size],
    queryFn: ({ queryKey }) =>
      getQuizzesAPI({
        page: queryKey.at(1) as number,
        size: queryKey.at(2) as number,
      }),
  });

  const quizzes = useMemo(
    () => ({
      quizzes: data?.data?.quizzes || [],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_quizzes: data?.data?.totalItem || 0,
    }),
    [data, page]
  );

  return { ...quizzes, ...others };
};

export const useQuiz = ({ id }: GetQuizProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: ({ queryKey }) =>
      getQuizAPI({ id: queryKey.at(-1) as GetQuizProps['id'] }),
    enabled: !!id,
  });

  const quiz = useMemo(() => data?.data.quiz, [data]);

  return { quiz, ...others };
};

export const useQuizMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const addQuizMutation = useMutation({
    mutationFn: (data: AddQuizModel) => addQuizAPI(data),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addNewQuiz = async (data: AddQuizModel) => {
    return addQuizMutation.mutateAsync(data);
  };

  const updateQuizMutation = useMutation({
    mutationFn: (vars: never[]) => updateQuizAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.setQueryData([QUERY_KEY, variables[0]], data);
    },
  });
  const updateQuiz = async (id: string, data: UpdateQuizModel) => {
    if (!id) return Promise.reject('invalid id');
    return updateQuizMutation.mutateAsync([id as never, data as never]);
  };

  const deleteQuizMutation = useMutation({
    mutationFn: (id: string) => deleteQuizAPI(id),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteQuiz = async (id: string) => {
    return deleteQuizMutation.mutateAsync(id);
  };

  return { addNewQuiz, updateQuiz, deleteQuiz };
};
