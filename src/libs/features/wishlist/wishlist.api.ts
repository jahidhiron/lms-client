import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddUpdateWishlistModel,
  AddUpdateWishlistModelResp,
  DeleteWishlistModelResp,
  GetWishlistModel,
  GetWishlistProps,
  ListWishlistsProps,
  ListWishlistModel,
} from './wishlist.model';

const endpoint = '/wishlists';

// API Endpoints
export const getWishlistsAPI = ({ page, size }: ListWishlistsProps) =>
  axios
    .get<any, AxiosResponse<ListWishlistModel, any>>(`${endpoint}`, {
      params: { page, size },
    }).then(data => data.data);

export const getWishlistAPI = ({ id }: GetWishlistProps) =>
  axios
    .get<any, AxiosResponse<GetWishlistModel, any>>(`${endpoint}/${id}`).then(data => data.data);

export const addWishlistAPI = (data: AddUpdateWishlistModel) =>
  axios
    .post<any, AxiosResponse<AddUpdateWishlistModelResp, any>>(
      `${endpoint}`,
      data
    ).then(data => data.data);

export const updateWishlistAPI = (id: string, data: AddUpdateWishlistModel) =>
  axios
    .put<any, AxiosResponse<AddUpdateWishlistModelResp, any>>(
      `${endpoint}/${id}`,
      data
    ).then(data => data.data);

export const deleteWishlistAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteWishlistModelResp, any>>(
      `${endpoint}/${id}`
    ).then(data => data.data);
