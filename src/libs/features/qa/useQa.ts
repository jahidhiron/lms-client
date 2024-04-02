import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import {
  addQAAPI,
  addQAReplyVoteAPI,
  addQAVoteAPI,
  addReplyQAAPI,
  deleteQAAPI,
  deleteQAReplyAPI,
  getQAAPI,
  getQAsAPI,
  updateQAAPI,
  updateQAReplyAPI,
} from './qa.api';
import {
  AddQAModel,
  AddReplyQAModel,
  GetQAProps,
  ListQAsProps,
  QaModel,
  UpdateQAModel,
  UpdateQAReplyModel,
} from './qa.model';

const QUERY_KEY = 'qas';

export const useQAs = ({
  page = 1,
  size = 10,
  q,
  courseId,
  lectureId,
}: ListQAsProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, page, size, courseId, lectureId, q],
    queryFn: () =>
      getQAsAPI({
        page,
        size,
        courseId,
        lectureId,
        q,
      }),
  });

  const qas = useMemo(
    () => ({
      qas: (data?.data?.qas || []) as QaModel[],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_qas: data?.data?.totalItem || 0,
    }),
    [data, page]
  );

  return { ...qas, ...others };
};

export const useQA = ({ id }: GetQAProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getQAAPI({ id }),
    enabled: !!id,
  });

  const qa = useMemo(() => data?.data.qa, [data]);

  return { qa, ...others };
};

export const useQAMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  // add qa
  const addQAMutation = useMutation({
    mutationFn: (data: AddQAModel) => addQAAPI(data),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addNewQA = async (data: AddQAModel) => {
    return addQAMutation.mutateAsync(data);
  };

  // update qa
  const updateQAMutation = useMutation({
    mutationFn: (vars: never[]) => updateQAAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.setQueryData([QUERY_KEY, variables[0]], data);
    },
  });
  const updateQA = async (id: string, data: UpdateQAModel) => {
    return updateQAMutation.mutateAsync([id as never, data as never]);
  };

  // update qa reply
  const updateQAReplyMutation = useMutation({
    mutationFn: (vars: never[]) => updateQAReplyAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.setQueryData([QUERY_KEY, variables[0]], data);
    },
  });
  const updateQAReply = async (id: string, data: UpdateQAReplyModel) => {
    return updateQAReplyMutation.mutateAsync([id as never, data as never]);
  };

  // add reply qa
  const AddReplyQAMutation = useMutation({
    mutationFn: (vars: never[]) => addReplyQAAPI(vars[0], vars[1]),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addReplyQA = async (id: string, data: AddReplyQAModel) => {
    return AddReplyQAMutation.mutateAsync([id as never, data as never]);
  };

  // add qa vote
  const addQAVoteMutation = useMutation({
    mutationFn: (id: string) => addQAVoteAPI(id),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, variables] });
    },
  });
  const addQAVote = async (id: string) => {
    return addQAVoteMutation.mutateAsync(id);
  };

  // add reply vote
  const addQAReplyVoteMutation = useMutation({
    mutationFn: (vars: [string, string]) => addQAReplyVoteAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, variables[0]] });
    },
  });
  const addQAReplyVote = async (qaId: string, replyId: string) => {
    return addQAReplyVoteMutation.mutateAsync([qaId, replyId]);
  };

  // delete qa
  const deleteQAMutation = useMutation({
    mutationFn: (id: string) => deleteQAAPI(id),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteQA = async (id: string) => {
    return deleteQAMutation.mutateAsync(id);
  };

  // delete qa reply
  const deleteQAReplyMutation = useMutation({
    mutationFn: (vars: never[]) => deleteQAReplyAPI(vars[0], vars[1]),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteQAReply = async (id: string, replyId: string) => {
    return deleteQAReplyMutation.mutateAsync([id as never, replyId as never]);
  };

  return {
    addNewQA,
    addReplyQA,
    addQAVote,
    addQAReplyVote,
    updateQA,
    updateQAReply,
    deleteQA,
    deleteQAReply,
  };
};
