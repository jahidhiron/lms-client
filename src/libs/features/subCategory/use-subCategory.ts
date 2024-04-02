import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import {
  addSubCategoryAPI,
  deleteSubCategoryAPI,
  getSubCategoriesAPI,
  getSubCategoryAPI,
  updateSubCategoryAPI,
} from './subCategory.api';
import {
  AddUpdateSubCategoryModel,
  GetSubCategoryProps,
  ListSubCategoriesProps,
  SubCategoryModel,
} from './subCategory.model';

const QUERY_KEY = 'subCategories';

export const useSubCategories = ({
  page = 1,
  size = 10,
  categoryId,
}: ListSubCategoriesProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, page, size, categoryId],
    queryFn: () =>
      getSubCategoriesAPI({
        page,
        size,
        categoryId,
      }),
  });

  const subCategories = useMemo(
    () => ({
      subCategories: (data?.data?.subCategories || []) as SubCategoryModel[],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_subCategories: data?.data?.totalItem || 0,
    }),
    [data, page]
  );

  return { ...subCategories, ...others };
};

export const useSubCategory = ({ id }: GetSubCategoryProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: ({ queryKey }) =>
      getSubCategoryAPI({ id: queryKey.at(-1) as GetSubCategoryProps['id'] }),
    enabled: !!id,
  });

  const subCategory = useMemo(() => data?.data.subCategory, [data]);

  return { subCategory, ...others };
};

export const useSubCategoryMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const addSubCategoryMutation = useMutation({
    mutationFn: (data: AddUpdateSubCategoryModel) => addSubCategoryAPI(data),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addNewSubCategory = async (data: AddUpdateSubCategoryModel) => {
    return addSubCategoryMutation.mutateAsync(data);
  };

  const updateSubCategoryMutation = useMutation({
    mutationFn: (vars: never[]) => updateSubCategoryAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.setQueryData([QUERY_KEY, variables[0]], data);
    },
  });
  const updateSubCategory = async (
    id: string,
    data: AddUpdateSubCategoryModel
  ) => {
    return updateSubCategoryMutation.mutateAsync([id as never, data as never]);
  };

  const deleteSubCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteSubCategoryAPI(id),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteSubCategory = async (id: string) => {
    return deleteSubCategoryMutation.mutateAsync(id);
  };

  return { addNewSubCategory, updateSubCategory, deleteSubCategory };
};
