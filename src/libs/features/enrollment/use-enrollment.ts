import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import {
  addEnrollmentAPI,
  completeLectureAPI,
  deleteEnrollmentAPI,
  getEnrollmentAPI,
  getEnrollmentsAPI,
  updateEnrollmentAPI,
} from './enrollment.api';
import {
  AddUpdateEnrollmentModel,
  GetEnrollmentProps,
  ListEnrollmentsProps,
} from './enrollment.model';

const QUERY_KEY = 'enrollments';

export const useEnrollments = ({
  page = 1,
  size = 10,
}: ListEnrollmentsProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, page, size],
    queryFn: ({ queryKey }) =>
      getEnrollmentsAPI({
        page: queryKey.at(1) as number,
        size: queryKey.at(2) as number,
      }),
  });

  const enrollments = useMemo(
    () => ({
      enrollments: data?.data?.enrollments || [],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_enrollments: data?.data?.totalItem || 0,
    }),
    [data, page]
  );

  return { ...enrollments, ...others };
};

export const useEnrollment = ({ id }: GetEnrollmentProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: ({ queryKey }) =>
      getEnrollmentAPI({ id: queryKey.at(-1) as GetEnrollmentProps['id'] }),
    enabled: !!id,
  });

  const enrollment = useMemo(() => data?.data.enrollment, [data]);

  return { enrollment, ...others };
};

export const useEnrollmentMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const addEnrollmentMutation = useMutation({
    mutationFn: (data: AddUpdateEnrollmentModel) => addEnrollmentAPI(data),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addNewEnrollment = async (data: AddUpdateEnrollmentModel) => {
    return addEnrollmentMutation.mutateAsync(data);
  };

  const completeLectureMutation = useMutation({
    mutationFn: (data: [string, string]) => completeLectureAPI(...data),
    onSuccess(_, vars) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, vars[0]] });
    },
  });
  const completeLecture = async (enrollmentId: string, lectureId: string) => {
    return completeLectureMutation.mutateAsync([enrollmentId, lectureId]);
  };

  const updateEnrollmentMutation = useMutation({
    mutationFn: (vars: never[]) => updateEnrollmentAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.setQueryData([QUERY_KEY, variables[0]], data);
    },
  });
  const updateEnrollment = async (
    id: string,
    data: AddUpdateEnrollmentModel
  ) => {
    return updateEnrollmentMutation.mutateAsync([id as never, data as never]);
  };

  const deleteEnrollmentMutation = useMutation({
    mutationFn: (id: string) => deleteEnrollmentAPI(id),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteEnrollment = async (id: string) => {
    return deleteEnrollmentMutation.mutateAsync(id);
  };

  return {
    addNewEnrollment,
    updateEnrollment,
    deleteEnrollment,
    completeLecture,
  };
};
