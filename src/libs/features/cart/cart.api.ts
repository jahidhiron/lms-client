import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddUpdateCartModel,
  AddUpdateCartModelResp,
  DeleteCartModelResp,
  GetCartModel,
  GetCartProps,
  ListCartModel,
  ListCartsProps,
} from './cart.model';

const endpoint = '/add-to-cart';

// API Endpoints
export const getCartsAPI = ({ page, size }: ListCartsProps) =>
  axios
    .get<any, AxiosResponse<ListCartModel, any>>(`${endpoint}`, {
      params: { page, size },
    })
    .then((data) => data.data);

export const getCartAPI = ({ id }: GetCartProps) =>
  axios
    .get<any, AxiosResponse<GetCartModel, any>>(`${endpoint}/${id}`)
    .then((data) => data.data);

export const addCartAPI = (data: AddUpdateCartModel) =>
  axios
    .post<any, AxiosResponse<AddUpdateCartModelResp, any>>(`${endpoint}`, data)
    .then((data) => data.data);

export const updateCartAPI = (id: string, data: AddUpdateCartModel) =>
  axios
    .put<any, AxiosResponse<AddUpdateCartModelResp, any>>(
      `${endpoint}/${id}`,
      data
    )
    .then((data) => data.data);

export const deleteCartAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteCartModelResp, any>>(`${endpoint}/${id}`)
    .then((data) => data.data);
