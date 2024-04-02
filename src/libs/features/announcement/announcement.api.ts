import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddUpdateAnnouncementModel,
  AddUpdateAnnouncementModelResp,
  DeleteAnnouncementModelResp,
  GetAnnouncementModel,
  GetAnnouncementProps,
  ListAnnouncementsProps,
  ListAnnouncementModel,
} from './announcement.model';

const endpoint = '/announcements';

// API Endpoints
export const getAnnouncementsAPI = ({ page, size }: ListAnnouncementsProps) =>
  axios
    .get<any, AxiosResponse<ListAnnouncementModel, any>>(`${endpoint}`, {
      params: { page, size },
    }).then(data => data.data);

export const getAnnouncementAPI = ({ id }: GetAnnouncementProps) =>
  axios
    .get<any, AxiosResponse<GetAnnouncementModel, any>>(`${endpoint}/${id}`).then(data => data.data);

export const addAnnouncementAPI = (data: AddUpdateAnnouncementModel) =>
  axios
    .post<any, AxiosResponse<AddUpdateAnnouncementModelResp, any>>(
      `${endpoint}`,
      data
    ).then(data => data.data);

export const updateAnnouncementAPI = (id: string, data: AddUpdateAnnouncementModel) =>
  axios
    .put<any, AxiosResponse<AddUpdateAnnouncementModelResp, any>>(
      `${endpoint}/${id}`,
      data
    ).then(data => data.data);

export const deleteAnnouncementAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteAnnouncementModelResp, any>>(
      `${endpoint}/${id}`
    ).then(data => data.data);
