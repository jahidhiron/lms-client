import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddQAModel,
  AddQAVoteModelResp,
  AddReplyQAModel,
  AddUpdateQAModelResp,
  DeleteQAModelResp,
  GetQAModel,
  GetQAProps,
  ListQAModel,
  ListQAsProps,
  UpdateQAModel,
  UpdateQAReplyModel,
} from './qa.model';

const endpoint = '/qas';

// API Endpoints
export const getQAsAPI = (params: ListQAsProps) =>
  axios
    .get<any, AxiosResponse<ListQAModel, any>>(`${endpoint}`, {
      params,
    })
    .then((data) => data.data);

export const getQAAPI = ({ id }: GetQAProps) =>
  axios
    .get<any, AxiosResponse<GetQAModel, any>>(`${endpoint}/${id}`)
    .then((data) => data.data);

export const addQAAPI = (data: AddQAModel) =>
  axios
    .post<any, AxiosResponse<AddUpdateQAModelResp, any>>(`${endpoint}`, data)
    .then((data) => data.data);

export const addReplyQAAPI = (id: string, data: AddReplyQAModel) =>
  axios
    .post<any, AxiosResponse<AddUpdateQAModelResp, any>>(
      `${endpoint}/reply/${id}`,
      data
    )
    .then((data) => data.data);

export const addQAVoteAPI = (id: string) =>
  axios
    .put<any, AxiosResponse<AddQAVoteModelResp, any>>(`${endpoint}/vote/${id}`)
    .then((data) => data.data);

export const addQAReplyVoteAPI = (qaId: string, replyId: string) =>
  axios
    .put<any, AxiosResponse<AddQAVoteModelResp, any>>(
      `${endpoint}/reply-vote/${qaId}`,
      { replyId }
    )
    .then((data) => data.data);

export const updateQAAPI = (id: string, data: UpdateQAModel) =>
  axios
    .put<any, AxiosResponse<AddUpdateQAModelResp, any>>(
      `${endpoint}/${id}`,
      data
    )
    .then((data) => data.data);

export const updateQAReplyAPI = (id: string, data: UpdateQAReplyModel) =>
  axios
    .put<any, AxiosResponse<AddUpdateQAModelResp, any>>(
      `${endpoint}/reply/${id}`,
      data
    )
    .then((data) => data.data);

export const deleteQAAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteQAModelResp, any>>(`${endpoint}/${id}`)
    .then((data) => data.data);

export const deleteQAReplyAPI = (id: string, replyId: string) =>
  axios
    .delete<any, AxiosResponse<DeleteQAModelResp, any>>(
      `${endpoint}/reply/${id}?replyId=${replyId}`
    )
    .then((data) => data.data);
