import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddUpdateUserModel,
  AddUpdateUserModelResp,
  DeleteUserModelResp,
  GetUserModel,
  GetUserProps,
  ListUsersProps,
  ListUserModel,
} from './user.model';

const endpoint = '/users';

// API Endpoints
export const getUsersAPI = ({ page, size }: ListUsersProps) =>
  axios
    .get<any, AxiosResponse<ListUserModel, any>>(`${endpoint}`, {
      params: { page, size },
    }).then(data => data.data);

export const getUserAPI = ({ id }: GetUserProps) =>
  axios
    .get<any, AxiosResponse<GetUserModel, any>>(`${endpoint}/${id}`).then(data => data.data);

export const addUserAPI = (data: AddUpdateUserModel) =>
  axios
    .post<any, AxiosResponse<AddUpdateUserModelResp, any>>(
      `${endpoint}`,
      data
    ).then(data => data.data);

export const updateUserAPI = (id: string, data: AddUpdateUserModel) =>
  axios
    .put<any, AxiosResponse<AddUpdateUserModelResp, any>>(
      `${endpoint}/${id}`,
      data
    ).then(data => data.data);

export const deleteUserAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteUserModelResp, any>>(
      `${endpoint}/${id}`
    ).then(data => data.data);
