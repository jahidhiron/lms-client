import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import {
  addUserAPI,
  deleteUserAPI,
  getUsersAPI,
  getUserAPI,
  updateUserAPI,
} from './user.api';
import {
  AddUpdateUserModel,
  GetUserProps,
  ListUsersProps,
} from './user.model';

const QUERY_KEY = 'users';

export const useUsers = ({ page = 1, size = 10 }: ListUsersProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, page, size],
    queryFn: ({ queryKey }) =>
      getUsersAPI({
        page: queryKey.at(1) as number,
        size: queryKey.at(2) as number,
      }),
  });

  const users = useMemo(
    () => ({
      users: data?.data?.users || [],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_users: data?.data?.totalItem || 0,
    }),
    [data, page]
  );

  return { ...users, ...others };
};

export const useUser = ({ id }: GetUserProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: ({ queryKey }) => getUserAPI({ id: queryKey.at(-1) as GetUserProps['id'] }),
    enabled: !!id,
  });

  const user = useMemo(() => data?.data.user, [data]);

  return { user, ...others };
};

export const useUserMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const addUserMutation = useMutation({
    mutationFn: (data: AddUpdateUserModel) => addUserAPI(data),
    onSuccess() {
      queryClient.refetchQueries({queryKey: [QUERY_KEY, page]});
    },
  });
  const addNewUser = async (data: AddUpdateUserModel) => {
    return addUserMutation.mutateAsync(data);
  };

  const updateUserMutation = useMutation({
    mutationFn: (vars: never[]) => updateUserAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({queryKey: [QUERY_KEY, page]});
      queryClient.setQueryData([QUERY_KEY, variables[0]], data);
    },
  });
  const updateUser = async (id: string, data: AddUpdateUserModel) => {
    return updateUserMutation.mutateAsync([id as never, data as never]);
  };

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUserAPI(id),
    onSuccess() {
      queryClient.refetchQueries({queryKey: [QUERY_KEY, page]});
    },
  });
  const deleteUser = async (id: string) => {
    return deleteUserMutation.mutateAsync(id);
  };

  return { addNewUser, updateUser, deleteUser };
};
