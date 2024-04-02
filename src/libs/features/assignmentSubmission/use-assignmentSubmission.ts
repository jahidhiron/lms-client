import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import {
  addAssignmentSubmissionAPI,
  deleteAssignmentSubmissionAPI,
  getAssignmentSubmissionAPI,
  getAssignmentSubmissionsAPI,
  submitAssignmentAnswerAPI,
  updateAssignmentSubmissionAPI,
} from './assignmentSubmission.api';
import {
  AddUpdateAssignmentSubmissionModel,
  GetAssignmentSubmissionProps,
  ListAssignmentSubmissionsProps,
} from './assignmentSubmission.model';

const QUERY_KEY = 'assignmentSubmissions';

export const useAssignmentSubmissions = ({
  page = 1,
  size = 10,
}: ListAssignmentSubmissionsProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, page, size],
    queryFn: ({ queryKey }) =>
      getAssignmentSubmissionsAPI({
        page: queryKey.at(1) as number,
        size: queryKey.at(2) as number,
      }),
  });

  const assignmentSubmissions = useMemo(
    () => ({
      assignmentSubmissions: data?.data?.assignmentAnswers || [],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_assignmentSubmissions: data?.data?.totalItem || 0,
    }),
    [data, page]
  );

  return { ...assignmentSubmissions, ...others };
};

export const useAssignmentSubmission = ({
  id,
}: GetAssignmentSubmissionProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: ({ queryKey }) =>
      getAssignmentSubmissionAPI({
        id: queryKey.at(-1) as GetAssignmentSubmissionProps['id'],
      }),
    enabled: !!id,
  });

  const assignmentSubmission = useMemo(
    () => data?.data.assignmentAnswer,
    [data]
  );

  return { assignmentSubmission, ...others };
};

export const useAssignmentSubmissionMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const addAssignmentSubmissionMutation = useMutation({
    mutationFn: (data: AddUpdateAssignmentSubmissionModel) =>
      addAssignmentSubmissionAPI(data),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addNewAssignmentSubmission = async (
    data: AddUpdateAssignmentSubmissionModel
  ) => {
    return addAssignmentSubmissionMutation.mutateAsync(data);
  };

  const updateAssignmentSubmissionMutation = useMutation({
    mutationFn: (vars: never[]) =>
      updateAssignmentSubmissionAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.setQueryData([QUERY_KEY, variables[0]], data);
    },
  });
  const updateAssignmentSubmission = async (
    id: string,
    data: AddUpdateAssignmentSubmissionModel
  ) => {
    return updateAssignmentSubmissionMutation.mutateAsync([
      id as never,
      data as never,
    ]);
  };

  const deleteAssignmentSubmissionMutation = useMutation({
    mutationFn: (id: string) => deleteAssignmentSubmissionAPI(id),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteAssignmentSubmission = async (id: string) => {
    return deleteAssignmentSubmissionMutation.mutateAsync(id);
  };

  const submitAssignmentAnswerMutation = useMutation({
    mutationFn: (id: string) => submitAssignmentAnswerAPI(id),
    onSuccess({ data }) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.refetchQueries({
        queryKey: [QUERY_KEY, data?.assignmentAnswer?.assignmentId],
      });
    },
  });
  const submitAssignmentAnswer = async (id: string) => {
    return submitAssignmentAnswerMutation.mutateAsync(id);
  };

  return {
    addNewAssignmentSubmission,
    updateAssignmentSubmission,
    deleteAssignmentSubmission,
    submitAssignmentAnswer,
  };
};
