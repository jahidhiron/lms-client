import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddUpdateSubCategoryModel,
  AddUpdateSubCategoryModelResp,
  DeleteSubCategoryModelResp,
  GetSubCategoryModel,
  GetSubCategoryProps,
  ListSubCategoriesProps,
  ListSubCategoryModel,
} from './subCategory.model';

const endpoint = '/sub-categories';

// API Endpoints
export const getSubCategoriesAPI = (params: ListSubCategoriesProps) =>
  axios
    .get<any, AxiosResponse<ListSubCategoryModel, any>>(`${endpoint}`, {
      params,
    })
    .then((data) => data.data);

export const getSubCategoryAPI = ({ id }: GetSubCategoryProps) =>
  axios
    .get<any, AxiosResponse<GetSubCategoryModel, any>>(`${endpoint}/${id}`)
    .then((data) => data.data);

export const addSubCategoryAPI = (data: AddUpdateSubCategoryModel) =>
  axios
    .post<any, AxiosResponse<AddUpdateSubCategoryModelResp, any>>(
      `${endpoint}`,
      data
    )
    .then((data) => data.data);

export const updateSubCategoryAPI = (
  id: string,
  data: AddUpdateSubCategoryModel
) =>
  axios
    .put<any, AxiosResponse<AddUpdateSubCategoryModelResp, any>>(
      `${endpoint}/${id}`,
      data
    )
    .then((data) => data.data);

export const deleteSubCategoryAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteSubCategoryModelResp, any>>(
      `${endpoint}/${id}`
    )
    .then((data) => data.data);
