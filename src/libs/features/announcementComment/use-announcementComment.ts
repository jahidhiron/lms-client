import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { queryClient } from '~/helpers/config';
import {
  addAnnouncementCommentAPI,
  deleteAnnouncementCommentAPI,
  updateAnnouncementCommentAPI,
} from './announcementComment.api';
import {
  AddAnnouncementCommentModel,
  UpdateAnnouncementCommentModel,
} from './announcementComment.model';

const QUERY_KEY = 'announcements';

export const useAnnouncementCommentMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const addAnnouncementCommentMutation = useMutation({
    mutationFn: (data: [string, AddAnnouncementCommentModel]) =>
      addAnnouncementCommentAPI(data[0], data[1]),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addNewAnnouncementComment = async (
    announcementId: string,
    data: AddAnnouncementCommentModel
  ) => {
    return addAnnouncementCommentMutation.mutateAsync([announcementId, data]);
  };

  const updateAnnouncementCommentMutation = useMutation({
    mutationFn: (vars: never[]) =>
      updateAnnouncementCommentAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.setQueryData([QUERY_KEY, variables[0]], data);
    },
  });
  const updateAnnouncementComment = async (
    id: string,
    data: UpdateAnnouncementCommentModel
  ) => {
    return updateAnnouncementCommentMutation.mutateAsync([
      id as never,
      data as never,
    ]);
  };

  const deleteAnnouncementCommentMutation = useMutation({
    mutationFn: (vars: string[]) =>
      deleteAnnouncementCommentAPI(vars[0], vars[1]),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteAnnouncementComment = async (id: string, commentId: string) => {
    return deleteAnnouncementCommentMutation.mutateAsync([id, commentId]);
  };

  return {
    addNewAnnouncementComment,
    updateAnnouncementComment,
    deleteAnnouncementComment,
  };
};
