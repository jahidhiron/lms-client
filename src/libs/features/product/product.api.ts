import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddUpdateProductModel,
  AddUpdateProductModelResp,
  DeleteProductModelResp,
  GetProductModel,
  GetProductProps,
  ListProductsProps,
  ListProductModel,
} from './product.model';

const endpoint = '/products';

// API Endpoints
export const getProductsAPI = ({ page, size }: ListProductsProps) =>
  axios
    .get<any, AxiosResponse<ListProductModel, any>>(`${endpoint}`, {
      params: { page, size },
    }).then(data => data.data);

export const getProductAPI = ({ id }: GetProductProps) =>
  axios
    .get<any, AxiosResponse<GetProductModel, any>>(`${endpoint}/${id}`).then(data => data.data);

export const addProductAPI = (data: AddUpdateProductModel) =>
  axios
    .post<any, AxiosResponse<AddUpdateProductModelResp, any>>(
      `${endpoint}`,
      data
    ).then(data => data.data);

export const updateProductAPI = (id: string, data: AddUpdateProductModel) =>
  axios
    .put<any, AxiosResponse<AddUpdateProductModelResp, any>>(
      `${endpoint}/${id}`,
      data
    ).then(data => data.data);

export const deleteProductAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteProductModelResp, any>>(
      `${endpoint}/${id}`
    ).then(data => data.data);
