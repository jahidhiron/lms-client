import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddUpdateReviewModel,
  AddUpdateReviewModelResp,
  DeleteReviewModelResp,
  GetReviewModel,
  GetReviewProps,
  ListReviewModel,
  ListReviewsProps,
} from './review.model';

const endpoint = '/reviews';

// API Endpoints
export const getReviewsAPI = (params: ListReviewsProps) =>
  axios
    .get<any, AxiosResponse<ListReviewModel, any>>(`${endpoint}`, {
      params,
    })
    .then((data) => data.data);

export const getReviewAPI = ({ id }: GetReviewProps) =>
  axios
    .get<any, AxiosResponse<GetReviewModel, any>>(`${endpoint}/${id}`)
    .then((data) => data.data);

export const addReviewAPI = (data: AddUpdateReviewModel) =>
  axios
    .post<any, AxiosResponse<AddUpdateReviewModelResp, any>>(
      `${endpoint}`,
      data
    )
    .then((data) => data.data);

export const updateReviewAPI = (id: string, data: AddUpdateReviewModel) =>
  axios
    .put<any, AxiosResponse<AddUpdateReviewModelResp, any>>(
      `${endpoint}/${id}`,
      data
    )
    .then((data) => data.data);

export const deleteReviewAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteReviewModelResp, any>>(`${endpoint}/${id}`)
    .then((data) => data.data);
