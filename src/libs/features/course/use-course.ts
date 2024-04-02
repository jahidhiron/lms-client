import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import {
  addCourseAPI,
  deleteCourseAPI,
  getCourseAPI,
  getCoursesAPI,
  updateCourseAPI,
} from './course.api';
import {
  AddCourseModel,
  CourseModel,
  GetCourseProps,
  ListCoursesProps,
  UpdateCourseModel,
} from './course.model';

const QUERY_KEY = 'courses';

export const useCourses = ({
  page = 1,
  size = 10,
  isPublic,
  subtitle,
  subCategoryId,
  sort,
  rating,
  quiz,
  q,
  assignment,
  categoryId,
  duration,
  level,
  paid,
}: ListCoursesProps) => {
  const { data, ...others } = useQuery({
    queryKey: [
      QUERY_KEY,
      page,
      size,
      isPublic,
      subtitle,
      subCategoryId,
      sort,
      rating,
      quiz,
      q,
      assignment,
      categoryId,
      duration,
      level,
      paid,
    ],
    queryFn: () =>
      getCoursesAPI({
        page,
        size,
        isPublic,
        subtitle,
        subCategoryId,
        sort,
        rating,
        quiz,
        q,
        assignment,
        categoryId,
        duration,
        level,
        paid,
      }),
  });

  const courses = useMemo(
    () => ({
      courses: (data?.data?.courses || []) as CourseModel[],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_courses: data?.data?.totalItem || 0,
      filters: data?.data?.filter,
    }),
    [data, page]
  );

  return { ...courses, ...others };
};

export const useCourse = ({ id, isPublic }: GetCourseProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, id, isPublic],
    queryFn: () => getCourseAPI({ id, isPublic }),
    enabled: !!id,
  });

  const course = useMemo(() => data?.data.course, [data]);

  return { course, ...others };
};

export const useCourseMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const addCourseMutation = useMutation({
    mutationFn: (data: AddCourseModel) => addCourseAPI(data),
    onSuccess(data) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addNewCourse = async (data: AddCourseModel) => {
    return addCourseMutation.mutateAsync(data);
  };

  const updateCourseMutation = useMutation({
    mutationFn: (vars: never[]) => updateCourseAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, variables[0]] });
    },
  });
  const updateCourse = async (id: string, data: UpdateCourseModel) => {
    return updateCourseMutation.mutateAsync([id as never, data as never]);
  };

  const deleteCourseMutation = useMutation({
    mutationFn: (id: string) => deleteCourseAPI(id),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteCourse = async (id: string) => {
    return deleteCourseMutation.mutateAsync(id);
  };

  return { addNewCourse, updateCourse, deleteCourse };
};
