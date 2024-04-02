import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import {
  addAnnouncementAPI,
  deleteAnnouncementAPI,
  getAnnouncementAPI,
  getAnnouncementsAPI,
  updateAnnouncementAPI,
} from './announcement.api';
import {
  AddUpdateAnnouncementModel,
  GetAnnouncementProps,
  ListAnnouncementsProps,
} from './announcement.model';

const QUERY_KEY = 'announcements';

export const useAnnouncements = ({
  page = 1,
  size = 10,
}: ListAnnouncementsProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, page, size],
    queryFn: () =>
      getAnnouncementsAPI({
        page,
        size,
      }),
  });

  const announcements = useMemo(
    () => ({
      announcements: data?.data?.announcements || [],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_announcements: data?.data?.totalItem || 0,
    }),
    [data, page]
  );

  return { ...announcements, ...others };
};

export const useAnnouncement = ({ id }: GetAnnouncementProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: ({ queryKey }) =>
      getAnnouncementAPI({ id: queryKey.at(-1) as GetAnnouncementProps['id'] }),
    enabled: !!id,
  });

  const announcement = useMemo(() => data?.data.announcement, [data]);

  return { announcement, ...others };
};

export const useAnnouncementMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const addAnnouncementMutation = useMutation({
    mutationFn: (data: AddUpdateAnnouncementModel) => addAnnouncementAPI(data),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addNewAnnouncement = async (data: AddUpdateAnnouncementModel) => {
    return addAnnouncementMutation.mutateAsync(data);
  };

  const updateAnnouncementMutation = useMutation({
    mutationFn: (vars: never[]) => updateAnnouncementAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.setQueryData([QUERY_KEY, variables[0]], data);
    },
  });
  const updateAnnouncement = async (
    id: string,
    data: AddUpdateAnnouncementModel
  ) => {
    return updateAnnouncementMutation.mutateAsync([id as never, data as never]);
  };

  const deleteAnnouncementMutation = useMutation({
    mutationFn: (id: string) => deleteAnnouncementAPI(id),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteAnnouncement = async (id: string) => {
    return deleteAnnouncementMutation.mutateAsync(id);
  };

  return { addNewAnnouncement, updateAnnouncement, deleteAnnouncement };
};
