import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddUpdateNoteModel,
  AddUpdateNoteModelResp,
  DeleteNoteModelResp,
  GetNoteModel,
  GetNoteProps,
  ListNoteModel,
  ListNotesProps,
} from './note.model';

const endpoint = '/notes';

// API Endpoints
export const getNotesAPI = ({
  page,
  size,
  lectureId,
  courseId,
}: ListNotesProps) =>
  axios
    .get<any, AxiosResponse<ListNoteModel, any>>(`${endpoint}`, {
      params: { page, size, lectureId, courseId },
    })
    .then((data) => data.data);

export const getNoteAPI = ({ id }: GetNoteProps) =>
  axios
    .get<any, AxiosResponse<GetNoteModel, any>>(`${endpoint}/${id}`)
    .then((data) => data.data);

export const addNoteAPI = (data: AddUpdateNoteModel) =>
  axios
    .post<any, AxiosResponse<AddUpdateNoteModelResp, any>>(`${endpoint}`, data)
    .then((data) => data.data);

export const updateNoteAPI = (id: string, data: AddUpdateNoteModel) =>
  axios
    .put<any, AxiosResponse<AddUpdateNoteModelResp, any>>(
      `${endpoint}/${id}`,
      data
    )
    .then((data) => data.data);

export const deleteNoteAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteNoteModelResp, any>>(`${endpoint}/${id}`)
    .then((data) => data.data);
