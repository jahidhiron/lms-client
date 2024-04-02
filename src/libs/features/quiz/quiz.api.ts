import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddQuizModel,
  AddUpdateQuizModelResp,
  DeleteQuizModelResp,
  GetQuizModel,
  GetQuizProps,
  ListQuizModel,
  ListQuizzesProps,
  UpdateQuizModel,
} from './quiz.model';

const endpoint = '/quizs';

// API Endpoints
export const getQuizzesAPI = ({ page, size }: ListQuizzesProps) =>
  axios
    .get<any, AxiosResponse<ListQuizModel, any>>(`${endpoint}`, {
      params: { page, size },
    })
    .then((data) => data.data);

export const getQuizAPI = ({ id }: GetQuizProps) =>
  axios
    .get<any, AxiosResponse<GetQuizModel, any>>(`${endpoint}/${id}`)
    .then((data) => data.data);

export const addQuizAPI = (data: AddQuizModel) =>
  axios
    .post<any, AxiosResponse<AddUpdateQuizModelResp, any>>(`${endpoint}`, data)
    .then((data) => data.data);

export const updateQuizAPI = (id: string, data: UpdateQuizModel) =>
  axios
    .put<any, AxiosResponse<AddUpdateQuizModelResp, any>>(
      `${endpoint}/${id}`,
      data
    )
    .then((data) => data.data);

export const deleteQuizAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteQuizModelResp, any>>(`${endpoint}/${id}`)
    .then((data) => data.data);
