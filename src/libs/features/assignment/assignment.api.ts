import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddAssignmentModel,
  AddUpdateAssignmentModelResp,
  DeleteAssignmentModelResp,
  GetAssignmentModel,
  GetAssignmentProps,
  ListAssignmentModel,
  ListAssignmentsProps,
  UpdateAssignmentModel,
} from './assignment.model';

const endpoint = '/assignments';

// API Endpoints
export const getAssignmentsAPI = ({ page, size }: ListAssignmentsProps) =>
  axios
    .get<any, AxiosResponse<ListAssignmentModel, any>>(`${endpoint}`, {
      params: { page, size },
    })
    .then((data) => data.data);

export const getAssignmentAPI = ({ id }: GetAssignmentProps) =>
  axios
    .get<any, AxiosResponse<GetAssignmentModel, any>>(`${endpoint}/${id}`)
    .then((data) => data.data);

export const addAssignmentAPI = (data: AddAssignmentModel) =>
  axios
    .post<any, AxiosResponse<AddUpdateAssignmentModelResp, any>>(
      `${endpoint}`,
      data
    )
    .then((data) => data.data);

export const updateAssignmentAPI = (id: string, data: UpdateAssignmentModel) =>
  axios
    .put<any, AxiosResponse<AddUpdateAssignmentModelResp, any>>(
      `${endpoint}/${id}`,
      data
    )
    .then((data) => data.data);

export const deleteAssignmentAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteAssignmentModelResp, any>>(
      `${endpoint}/${id}`
    )
    .then((data) => data.data);
