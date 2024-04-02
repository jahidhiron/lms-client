import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import {
  addCategoryAPI,
  deleteCategoryAPI,
  getCategoriesAPI,
  getCategoryAPI,
  updateCategoryAPI,
} from './category.api';
import {
  AddUpdateCategoryModel,
  CategoryModel,
  GetCategoryProps,
  ListCategoriesProps,
} from './category.model';

const QUERY_KEY = 'categories';

export const useCategories = ({ page = 1, size = 10 }: ListCategoriesProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, page, size],
    queryFn: ({ queryKey }) =>
      getCategoriesAPI({
        page: queryKey.at(1) as number,
        size: queryKey.at(2) as number,
      }),
  });

  const categories = useMemo(
    () => ({
      categories: (data?.data?.categories || []) as CategoryModel[],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_categories: data?.data?.totalItem || 0,
    }),
    [data, page]
  );

  return { ...categories, ...others };
};

export const useCategory = ({ id }: GetCategoryProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: ({ queryKey }) =>
      getCategoryAPI({ id: queryKey.at(-1) as GetCategoryProps['id'] }),
    enabled: !!id,
  });

  const category = useMemo(() => data?.data.category, [data]);

  return { category, ...others };
};

export const useCategoryMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const addCategoryMutation = useMutation({
    mutationFn: (data: AddUpdateCategoryModel) => addCategoryAPI(data),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addNewCategory = async (data: AddUpdateCategoryModel) => {
    return addCategoryMutation.mutateAsync(data);
  };

  const updateCategoryMutation = useMutation({
    mutationFn: ([id, data]: [string, AddUpdateCategoryModel]) =>
      updateCategoryAPI(id, data),

    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const updateCategory = async (id: string, data: AddUpdateCategoryModel) => {
    return updateCategoryMutation.mutateAsync([id, data]);
  };

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteCategoryAPI(id),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteCategory = async (id: string) => {
    return deleteCategoryMutation.mutateAsync(id);
  };

  return { addNewCategory, updateCategory, deleteCategory };
};
