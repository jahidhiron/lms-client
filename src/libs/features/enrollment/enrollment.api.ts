import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddUpdateEnrollmentModel,
  AddUpdateEnrollmentModelResp,
  DeleteEnrollmentModelResp,
  GetEnrollmentModel,
  GetEnrollmentProps,
  ListEnrollmentModel,
  ListEnrollmentsProps,
} from './enrollment.model';

const endpoint = '/enrollments';

// API Endpoints
export const getEnrollmentsAPI = ({ page, size }: ListEnrollmentsProps) =>
  axios
    .get<any, AxiosResponse<ListEnrollmentModel, any>>(`${endpoint}`, {
      params: { page, size },
    })
    .then((data) => data.data);

export const getEnrollmentAPI = ({ id }: GetEnrollmentProps) =>
  axios
    .get<any, AxiosResponse<GetEnrollmentModel, any>>(`${endpoint}/${id}`)
    .then((data) => data.data);

export const addEnrollmentAPI = (data: AddUpdateEnrollmentModel) =>
  axios
    .post<any, AxiosResponse<AddUpdateEnrollmentModelResp, any>>(
      `${endpoint}`,
      data
    )
    .then((data) => data.data);

export const completeLectureAPI = (enrollmentId: string, lectureId: string) =>
  axios
    .put<any, AxiosResponse<AddUpdateEnrollmentModelResp, any>>(
      `${endpoint}/complete/${enrollmentId}`,
      { lectureId }
    )
    .then((data) => data.data);

export const updateEnrollmentAPI = (
  id: string,
  data: AddUpdateEnrollmentModel
) =>
  axios
    .put<any, AxiosResponse<AddUpdateEnrollmentModelResp, any>>(
      `${endpoint}/${id}`,
      data
    )
    .then((data) => data.data);

export const deleteEnrollmentAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteEnrollmentModelResp, any>>(
      `${endpoint}/${id}`
    )
    .then((data) => data.data);
