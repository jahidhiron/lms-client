import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import {
  addWishlistAPI,
  deleteWishlistAPI,
  getWishlistAPI,
  getWishlistsAPI,
  updateWishlistAPI,
} from './wishlist.api';
import {
  AddUpdateWishlistModel,
  GetWishlistProps,
  ListWishlistsProps,
} from './wishlist.model';

const QUERY_KEY = 'wishlists';

export const useWishlists = ({ page = 1, size = 10 }: ListWishlistsProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, page, size],
    queryFn: () =>
      getWishlistsAPI({
        page,
        size,
      }),
  });

  const wishlists = useMemo(
    () => ({
      wishlists: data?.data?.wishlists || [],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_wishlists: data?.data?.totalItem || 0,
    }),
    [data, page]
  );

  return { ...wishlists, ...others };
};

export const useWishlist = ({ id }: GetWishlistProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: ({ queryKey }) =>
      getWishlistAPI({ id: queryKey.at(-1) as GetWishlistProps['id'] }),
    enabled: !!id,
  });

  const wishlist = useMemo(() => data?.data.wishlist, [data]);

  return { wishlist, ...others };
};

export const useWishlistMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const addWishlistMutation = useMutation({
    mutationFn: (data: AddUpdateWishlistModel) => addWishlistAPI(data),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addNewWishlist = async (data: AddUpdateWishlistModel) => {
    return addWishlistMutation.mutateAsync(data);
  };

  const updateWishlistMutation = useMutation({
    mutationFn: (vars: never[]) => updateWishlistAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.setQueryData([QUERY_KEY, variables[0]], data);
    },
  });
  const updateWishlist = async (id: string, data: AddUpdateWishlistModel) => {
    return updateWishlistMutation.mutateAsync([id as never, data as never]);
  };

  const deleteWishlistMutation = useMutation({
    mutationFn: (id: string) => deleteWishlistAPI(id),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteWishlist = async (id: string) => {
    return deleteWishlistMutation.mutateAsync(id);
  };

  return { addNewWishlist, updateWishlist, deleteWishlist };
};
