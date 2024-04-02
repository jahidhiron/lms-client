import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import {
  addFileAPI,
  deleteFileAPI,
  getFileAPI,
  getFilesAPI,
  updateFileAPI,
} from './file.api';
import { AddUpdateFileModel, GetFileProps, ListFilesProps } from './file.model';

const QUERY_KEY = 'files';

export const useFiles = ({ page = 1, size = 10, type, q }: ListFilesProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, page, size, type, q],
    queryFn: () =>
      getFilesAPI({
        page,
        size,
        type,
        q,
      }),
  });

  const files = useMemo(
    () => ({
      files: data?.data?.files || [],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_files: data?.data?.totalItem || 0,
    }),
    [data, page]
  );

  return { ...files, ...others };
};

export const useFile = ({ id }: GetFileProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: ({ queryKey }) =>
      getFileAPI({ id: queryKey.at(-1) as GetFileProps['id'] }),
    enabled: !!id,
  });

  const file = useMemo(() => data?.data.file, [data]);

  return { file, ...others };
};

export const useFileMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const addFileMutation = useMutation({
    mutationFn: (data: never[]) => addFileAPI(data[0], data[1]),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addNewFile = async (
    data: AddUpdateFileModel,
    onProgress?: AxiosRequestConfig['onUploadProgress']
  ) => {
    return addFileMutation.mutateAsync([data as never, onProgress as never]);
  };

  const updateFileMutation = useMutation({
    mutationFn: (vars: never[]) => updateFileAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.setQueryData([QUERY_KEY, variables[0]], data);
    },
  });
  const updateFile = async (id: string, data: AddUpdateFileModel) => {
    return updateFileMutation.mutateAsync([id as never, data as never]);
  };

  const deleteFileMutation = useMutation({
    mutationFn: (id: string) => deleteFileAPI(id),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteFile = async (id: string) => {
    return deleteFileMutation.mutateAsync(id);
  };

  return { addNewFile, updateFile, deleteFile };
};
