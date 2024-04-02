import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddUpdateAssignmentSubmissionModel,
  AddUpdateAssignmentSubmissionModelResp,
  DeleteAssignmentSubmissionModelResp,
  GetAssignmentSubmissionModel,
  GetAssignmentSubmissionProps,
  ListAssignmentSubmissionModel,
  ListAssignmentSubmissionsProps,
} from './assignmentSubmission.model';

const endpoint = '/assignment-answers';

// API Endpoints
export const getAssignmentSubmissionsAPI = ({
  page,
  size,
}: ListAssignmentSubmissionsProps) =>
  axios
    .get<any, AxiosResponse<ListAssignmentSubmissionModel, any>>(
      `${endpoint}`,
      {
        params: { page, size },
      }
    )
    .then((data) => data.data);

export const getAssignmentSubmissionAPI = ({
  id,
}: GetAssignmentSubmissionProps) =>
  axios
    .get<any, AxiosResponse<GetAssignmentSubmissionModel, any>>(
      `${endpoint}/${id}`
    )
    .then((data) => data.data);

export const addAssignmentSubmissionAPI = (
  data: AddUpdateAssignmentSubmissionModel
) =>
  axios
    .post<AddUpdateAssignmentSubmissionModelResp>(`${endpoint}`, data)
    .then((data) => data.data);

export const updateAssignmentSubmissionAPI = (
  id: string,
  data: AddUpdateAssignmentSubmissionModel
) =>
  axios
    .put<any, AxiosResponse<AddUpdateAssignmentSubmissionModelResp, any>>(
      `${endpoint}/${id}`,
      data
    )
    .then((data) => data.data);

export const deleteAssignmentSubmissionAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteAssignmentSubmissionModelResp, any>>(
      `${endpoint}/${id}`
    )
    .then((data) => data.data);

export const submitAssignmentAnswerAPI = (id: string) =>
  axios
    .put<any, AxiosResponse<AddUpdateAssignmentSubmissionModelResp, any>>(
      `${endpoint}/submit/${id}`
    )
    .then((data) => data.data);
