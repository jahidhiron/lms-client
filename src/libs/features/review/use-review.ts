import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import {
  addReviewAPI,
  deleteReviewAPI,
  getReviewAPI,
  getReviewsAPI,
  updateReviewAPI,
} from './review.api';
import {
  AddUpdateReviewModel,
  GetReviewProps,
  ListReviewsProps,
  ReviewModel,
} from './review.model';

const QUERY_KEY = 'reviews';

export const useReviews = ({
  page = 1,
  size = 10,
  q,
  courseId,
  rating,
}: ListReviewsProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, page, size, q, rating],
    queryFn: ({ queryKey }) =>
      getReviewsAPI({
        page,
        size,
        courseId,
        q,
        rating,
      }),
  });

  const reviews = useMemo(
    () => ({
      reviews: (data?.data?.reviews || []) as ReviewModel[],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_reviews: data?.data?.totalItem || 0,
    }),
    [data, page]
  );

  return { ...reviews, ...others };
};

export const useReview = ({ id }: GetReviewProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: ({ queryKey }) =>
      getReviewAPI({ id: queryKey.at(-1) as GetReviewProps['id'] }),
    enabled: !!id,
  });

  const review = useMemo(() => data?.data.review, [data]);

  return { review, ...others };
};

export const useReviewMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const addReviewMutation = useMutation({
    mutationFn: (data: AddUpdateReviewModel) => addReviewAPI(data),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addNewReview = async (data: AddUpdateReviewModel) => {
    return addReviewMutation.mutateAsync(data);
  };

  const updateReviewMutation = useMutation({
    mutationFn: (vars: never[]) => updateReviewAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.setQueryData([QUERY_KEY, variables[0]], data);
    },
  });
  const updateReview = async (id: string, data: AddUpdateReviewModel) => {
    return updateReviewMutation.mutateAsync([id as never, data as never]);
  };

  const deleteReviewMutation = useMutation({
    mutationFn: (id: string) => deleteReviewAPI(id),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteReview = async (id: string) => {
    return deleteReviewMutation.mutateAsync(id);
  };

  return { addNewReview, updateReview, deleteReview };
};
