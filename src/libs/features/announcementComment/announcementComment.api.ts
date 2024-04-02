import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddAnnouncementCommentModel,
  AddUpdateAnnouncementCommentModelResp,
  DeleteAnnouncementCommentModelResp,
  UpdateAnnouncementCommentModel,
} from './announcementComment.model';

const endpoint = '/announcements';

export const addAnnouncementCommentAPI = (
  announcementId: string,
  data: AddAnnouncementCommentModel
) =>
  axios
    .post<any, AxiosResponse<AddUpdateAnnouncementCommentModelResp, any>>(
      `${endpoint}/add-comment/${announcementId}`,
      data
    )
    .then((data) => data.data);

export const updateAnnouncementCommentAPI = (
  announcementId: string,
  data: UpdateAnnouncementCommentModel
) =>
  axios
    .put<any, AxiosResponse<AddUpdateAnnouncementCommentModelResp, any>>(
      `${endpoint}/update-comment/${announcementId}`,
      data
    )
    .then((data) => data.data);

export const deleteAnnouncementCommentAPI = (
  announcementId: string,
  commentId: string
) =>
  axios
    .delete<any, AxiosResponse<DeleteAnnouncementCommentModelResp, any>>(
      `${endpoint}/delete-comment/${announcementId}`,
      { data: { commentId } }
    )
    .then((data) => data.data);
