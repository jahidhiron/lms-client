import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import { getProfileAPI, updateProfileAPI } from './profile.api';
import { AddUpdateProfileModel } from './profile.model';

const QUERY_KEY = 'profiles';

export const useProfile = () => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => getProfileAPI(),
  });

  const profile = useMemo(() => data?.data.userProfile, [data]);

  return { profile, ...others };
};

export const useProfileMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const updateProfileMutation = useMutation({
    mutationFn: (vars: never[]) => updateProfileAPI(vars[0]),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.refetchQueries({ queryKey: [QUERY_KEY] });
    },
  });
  const updateProfile = async (data: AddUpdateProfileModel) => {
    return updateProfileMutation.mutateAsync([data as never]);
  };
  return { updateProfile };
};
