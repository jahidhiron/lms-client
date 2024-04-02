import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddUpdateQuizSubmissionModel,
  AddUpdateQuizSubmissionModelResp,
  DeleteQuizSubmissionModelResp,
  GetQuizSubmissionModel,
  GetQuizSubmissionProps,
  ListQuizSubmissionModel,
  ListQuizSubmissionsProps,
} from './quizSubmission.model';

const endpoint = '/quiz-answer';

// API Endpoints
export const getQuizSubmissionsAPI = ({
  page,
  size,
}: ListQuizSubmissionsProps) =>
  axios
    .get<any, AxiosResponse<ListQuizSubmissionModel, any>>(`${endpoint}`, {
      params: { page, size },
    })
    .then((data) => data.data);

export const getQuizSubmissionAPI = ({ quizId }: GetQuizSubmissionProps) =>
  axios
    .get<any, AxiosResponse<GetQuizSubmissionModel, any>>(
      `${endpoint}/${quizId}`
    )
    .then((data) => data.data);

export const addQuizSubmissionAPI = (data: AddUpdateQuizSubmissionModel) =>
  axios
    .post<any, AxiosResponse<AddUpdateQuizSubmissionModelResp, any>>(
      `${endpoint}`,
      data
    )
    .then((data) => data.data);

export const updateQuizSubmissionAPI = (
  id: string,
  data: AddUpdateQuizSubmissionModel
) =>
  axios
    .put<any, AxiosResponse<AddUpdateQuizSubmissionModelResp, any>>(
      `${endpoint}/${id}`,
      data
    )
    .then((data) => data.data);

export const deleteQuizSubmissionAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteQuizSubmissionModelResp, any>>(
      `${endpoint}/${id}`
    )
    .then((data) => data.data);
