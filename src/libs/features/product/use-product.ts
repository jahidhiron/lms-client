import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import {
  addProductAPI,
  deleteProductAPI,
  getProductsAPI,
  getProductAPI,
  updateProductAPI,
} from './product.api';
import {
  AddUpdateProductModel,
  GetProductProps,
  ListProductsProps,
} from './product.model';

const QUERY_KEY = 'products';

export const useProducts = ({ page = 1, size = 10 }: ListProductsProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, page, size],
    queryFn: ({ queryKey }) =>
      getProductsAPI({
        page: queryKey.at(1) as number,
        size: queryKey.at(2) as number,
      }),
  });

  const products = useMemo(
    () => ({
      products: data?.data?.products || [],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_products: data?.data?.totalItem || 0,
    }),
    [data, page, size]
  );

  return { ...products, ...others };
};

export const useProduct = ({ id }: GetProductProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: ({ queryKey }) => getProductAPI({ id: queryKey.at(-1) as GetProductProps['id'] }),
    enabled: !!id,
  });

  const product = useMemo(() => data?.data.product, [data]);

  return { product, ...others };
};

export const useProductMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const addProductMutation = useMutation({
    mutationFn: (data: AddUpdateProductModel) => addProductAPI(data),
    onSuccess() {
      queryClient.refetchQueries({queryKey: [QUERY_KEY, page]});
    },
  });
  const addNewProduct = async (data: AddUpdateProductModel) => {
    return addProductMutation.mutateAsync(data);
  };

  const updateProductMutation = useMutation({
    mutationFn: (vars: never[]) => updateProductAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({queryKey: [QUERY_KEY, page]});
      queryClient.setQueryData([QUERY_KEY, variables[0]], data);
    },
  });
  const updateProduct = async (id: string, data: AddUpdateProductModel) => {
    return updateProductMutation.mutateAsync([id as never, data as never]);
  };

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => deleteProductAPI(id),
    onSuccess() {
      queryClient.refetchQueries({queryKey: [QUERY_KEY, page]});
    },
  });
  const deleteProduct = async (id: string) => {
    return deleteProductMutation.mutateAsync(id);
  };

  return { addNewProduct, updateProduct, deleteProduct };
};
