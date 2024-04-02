import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddLectureModel,
  AddUpdateLectureModelResp,
  DeleteLectureModelResp,
  GetLectureModel,
  GetLectureProps,
  ListLectureModel,
  ListLecturesProps,
  UpdateLectureModel,
} from './lecture.model';

const endpoint = '/lectures';

// API Endpoints
export const getLecturesAPI = ({ page, size }: ListLecturesProps) =>
  axios
    .get<any, AxiosResponse<ListLectureModel, any>>(`${endpoint}`, {
      params: { page, size },
    })
    .then((data) => data.data);

export const getLectureAPI = ({ id, isPublic }: GetLectureProps) =>
  axios
    .get<any, AxiosResponse<GetLectureModel, any>>(
      `${endpoint}/${isPublic ? 'public/' : ''}${id}`
    )
    .then((data) => data.data);

export const addLectureAPI = (data: AddLectureModel) =>
  axios
    .post<any, AxiosResponse<AddUpdateLectureModelResp, any>>(
      `${endpoint}`,
      data
    )
    .then((data) => data.data);

export const updateLectureAPI = (id: string, data: UpdateLectureModel) =>
  axios
    .put<any, AxiosResponse<AddUpdateLectureModelResp, any>>(
      `${endpoint}/${id}`,
      data
    )
    .then((data) => data.data);

export const deleteLectureAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteLectureModelResp, any>>(
      `${endpoint}/${id}`
    )
    .then((data) => data.data);
