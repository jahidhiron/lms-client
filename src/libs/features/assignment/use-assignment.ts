import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import {
  addAssignmentAPI,
  deleteAssignmentAPI,
  getAssignmentAPI,
  getAssignmentsAPI,
  updateAssignmentAPI,
} from './assignment.api';
import {
  AddAssignmentModel,
  AssignmentModel,
  GetAssignmentProps,
  ListAssignmentsProps,
  UpdateAssignmentModel,
} from './assignment.model';

const QUERY_KEY = 'assignments';

export const useAssignments = ({
  page = 1,
  size = 10,
}: ListAssignmentsProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, page, size],
    queryFn: ({ queryKey }) =>
      getAssignmentsAPI({
        page: queryKey.at(1) as number,
        size: queryKey.at(2) as number,
      }),
  });

  const assignments = useMemo(
    () => ({
      assignments: data?.data?.assignments || [],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_assignments: data?.data?.totalItem || 0,
    }),
    [data, page]
  );

  return { ...assignments, ...others };
};

export const useAssignment = ({ id }: GetAssignmentProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: ({ queryKey }) =>
      getAssignmentAPI({ id: queryKey.at(-1) as GetAssignmentProps['id'] }),
    enabled: !!id,
  });

  const assignment = useMemo(() => data?.data.assignment, [data]);

  return { assignment, ...others };
};

export const useAssignmentMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const addAssignmentMutation = useMutation({
    mutationFn: (data: AddAssignmentModel) => addAssignmentAPI(data),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addNewAssignment = async (data: AddAssignmentModel) => {
    return addAssignmentMutation.mutateAsync(data);
  };

  const updateAssignmentMutation = useMutation({
    mutationFn: (vars: never[]) => updateAssignmentAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, variables[0]] });
    },
  });
  const updateAssignment = async (id: string, data: UpdateAssignmentModel) => {
    return updateAssignmentMutation.mutateAsync([id as never, data as never]);
  };

  const partialUpdateAssignment = async (
    id: string,
    newData: Partial<UpdateAssignmentModel>,
    oldData?: AssignmentModel
  ) => {
    let data: UpdateAssignmentModel = {
      instructionVideoId: oldData?.instructionVideoId || null,
      instructionFileId: oldData?.instructionFileId || null,
      instructionDesc: oldData?.instructionDesc || '',
      title: oldData?.title || '',
      desc: oldData?.desc || '',
      duration: oldData?.duration || 0,
      questions: oldData?.questions || [],
      courseId: oldData?.courseId || '',
      solutionFileId: oldData?.solutionFileId || null,
      solutionVideoId: oldData?.solutionVideoId || null,
    };
    data = { ...data, ...newData };
    return updateAssignmentMutation.mutateAsync([id as never, data as never]);
  };

  const deleteAssignmentMutation = useMutation({
    mutationFn: (id: string) => deleteAssignmentAPI(id),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteAssignment = async (id: string) => {
    return deleteAssignmentMutation.mutateAsync(id);
  };

  return {
    addNewAssignment,
    updateAssignment,
    partialUpdateAssignment,
    deleteAssignment,
  };
};
