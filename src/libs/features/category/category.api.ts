import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddUpdateCategoryModel,
  AddUpdateCategoryModelResp,
  DeleteCategoryModelResp,
  GetCategoryModel,
  GetCategoryProps,
  ListCategoriesProps,
  ListCategoryModel,
} from './category.model';

const endpoint = '/categories';

// API Endpoints
export const getCategoriesAPI = ({ page, size }: ListCategoriesProps) =>
  axios
    .get<any, AxiosResponse<ListCategoryModel, any>>(`${endpoint}`, {
      params: { page, size },
    })
    .then((data) => data.data);

export const getCategoryAPI = ({ id }: GetCategoryProps) =>
  axios
    .get<any, AxiosResponse<GetCategoryModel, any>>(`${endpoint}/${id}`)
    .then((data) => data.data);

export const addCategoryAPI = (data: AddUpdateCategoryModel) =>
  axios
    .post<any, AxiosResponse<AddUpdateCategoryModelResp, any>>(
      `${endpoint}`,
      data
    )
    .then((data) => data.data);

export const updateCategoryAPI = (id: string, data: AddUpdateCategoryModel) =>
  axios
    .put<any, AxiosResponse<AddUpdateCategoryModelResp, any>>(
      `${endpoint}/${id}`,
      data
    )
    .then((data) => data.data);

export const deleteCategoryAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteCategoryModelResp, any>>(
      `${endpoint}/${id}`
    )
    .then((data) => data.data);
