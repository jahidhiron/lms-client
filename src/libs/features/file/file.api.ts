import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddUpdateFileModel,
  AddUpdateFileModelResp,
  DeleteFileModelResp,
  GetFileModel,
  GetFileProps,
  ListFileModel,
  ListFilesProps,
} from './file.model';

const endpoint = '/files';

// API Endpoints
export const getFilesAPI = (params: ListFilesProps) =>
  axios
    .get<any, AxiosResponse<ListFileModel, any>>(`${endpoint}`, {
      params,
    })
    .then((data) => data.data);

export const getFileAPI = ({ id }: GetFileProps) =>
  axios
    .get<any, AxiosResponse<GetFileModel, any>>(`${endpoint}/${id}`)
    .then((data) => data.data);

export const addFileAPI = (
  data: AddUpdateFileModel,
  onProgress?: AxiosRequestConfig['onUploadProgress']
) => {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('type', data.type.toString());
  return axios
    .post<any, AxiosResponse<AddUpdateFileModelResp, any>>(
      `${endpoint}`,
      formData,
      {
        onUploadProgress: onProgress,
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    .then((data) => data.data);
};
export const updateFileAPI = (id: string, data: AddUpdateFileModel) =>
  axios
    .put<any, AxiosResponse<AddUpdateFileModelResp, any>>(
      `${endpoint}/${id}`,
      data
    )
    .then((data) => data.data);

export const deleteFileAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteFileModelResp, any>>(`${endpoint}/${id}`)
    .then((data) => data.data);
