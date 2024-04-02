import { AxiosResponse } from 'axios';
import { axios } from '~/helpers/config';
import {
  AddUpdateProfileModel,
  AddUpdateProfileModelResp,
  GetProfileModel,
} from './profile.model';

const endpoint = '/profiles';

export const getProfileAPI = () =>
  axios
    .get<any, AxiosResponse<GetProfileModel, any>>(`${endpoint}`)
    .then((data) => data.data);

export const updateProfileAPI = (data: AddUpdateProfileModel) =>
  axios
    .put<any, AxiosResponse<AddUpdateProfileModelResp, any>>(
      `${endpoint}`,
      data
    )
    .then((data) => data.data);
