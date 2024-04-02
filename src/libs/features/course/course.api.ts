import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddCourseModel,
  AddUpdateCourseModelResp,
  DeleteCourseModelResp,
  GetCourseModel,
  GetCourseProps,
  ListCourseModel,
  ListCoursesProps,
  UpdateCourseModel,
} from './course.model';

const endpoint = '/courses';

// API Endpoints
export const getCoursesAPI = ({ isPublic, ...params }: ListCoursesProps) =>
  axios
    .get<any, AxiosResponse<ListCourseModel, any>>(
      `${endpoint}/${isPublic ? 'public' : ''}`,
      {
        params: {
          ...params,
        },
      }
    )
    .then((data) => data.data);

export const getCourseAPI = ({ id, isPublic }: GetCourseProps) =>
  axios
    .get<any, AxiosResponse<GetCourseModel, any>>(
      `${endpoint}/${isPublic ? '/public/' : ''}${id}`
    )
    .then((data) => data.data);

export const addCourseAPI = (data: AddCourseModel) =>
  axios
    .post<any, AxiosResponse<AddUpdateCourseModelResp, any>>(
      `${endpoint}`,
      data
    )
    .then((data) => data.data);

export const updateCourseAPI = (
  id: string,
  {
    prerequisites,
    whatWillLearn,
    whoIsThisCourseFor,
    sections,
    ...data
  }: UpdateCourseModel
) => {
  return axios
    .put<any, AxiosResponse<AddUpdateCourseModelResp, any>>(
      `${endpoint}/${id}`,
      {
        ...data,
        sections: sections?.map((s) => {
          delete s['_id'];
          return s;
        }),
        prerequisites: prerequisites?.map((p) => p.value),
        whoIsThisCourseFor: whoIsThisCourseFor?.map((wtc) => wtc.value),
        whatWillLearn: whatWillLearn?.map((wwl) => wwl.value),
      }
    )
    .then((data) => data.data);
};

export const deleteCourseAPI = (id: string) =>
  axios
    .delete<any, AxiosResponse<DeleteCourseModelResp, any>>(`${endpoint}/${id}`)
    .then((data) => data.data);
