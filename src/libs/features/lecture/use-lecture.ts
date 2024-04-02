import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import {
  addLectureAPI,
  deleteLectureAPI,
  getLectureAPI,
  getLecturesAPI,
  updateLectureAPI,
} from './lecture.api';
import {
  AddLectureModel,
  GetLectureProps,
  ListLecturesProps,
  UpdateLectureModel,
} from './lecture.model';

const QUERY_KEY = 'lectures';

export const useLectures = ({ page = 1, size = 10 }: ListLecturesProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, page, size],
    queryFn: () =>
      getLecturesAPI({
        page,
        size,
      }),
  });

  const lectures = useMemo(
    () => ({
      lectures: data?.data?.lectures || [],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_lectures: data?.data?.totalItem || 0,
    }),
    [data, page]
  );

  return { ...lectures, ...others };
};

export const useLecture = ({ id, isPublic = false }: GetLectureProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, id, isPublic],
    queryFn: () => getLectureAPI({ id, isPublic }),
    enabled: !!id,
  });

  const lecture = useMemo(() => data?.data.lecture, [data]);

  return { lecture, ...others };
};

export const useLectureMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const addLectureMutation = useMutation({
    mutationFn: (data: AddLectureModel) => addLectureAPI(data),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addNewLecture = async (data: AddLectureModel) => {
    return addLectureMutation.mutateAsync(data);
  };

  const updateLectureMutation = useMutation({
    mutationFn: (vars: never[]) => updateLectureAPI(vars[0], vars[1]),
    onSuccess(_data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, variables[0]] });
    },
  });
  const updateLecture = async (id: string, data: UpdateLectureModel) => {
    return updateLectureMutation.mutateAsync([id as never, data as never]);
  };

  const deleteLectureMutation = useMutation({
    mutationFn: (id: string) => deleteLectureAPI(id),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteLecture = async (id: string) => {
    return deleteLectureMutation.mutateAsync(id);
  };

  return { addNewLecture, updateLecture, deleteLecture };
};
