import { ROLES } from '~/helpers/constants';
import {
  GetFeatureModel,
  GetFeatureProps,
  ListFeatureModel,
  ListFeaturesProps,
} from '~/helpers/shared-model';
import { FileModel } from '../file/file.model';

export type GetUserProps = GetFeatureProps;

export type ListUsersProps = ListFeaturesProps;

export type UserModel = {
  _id: string;
  name: string;
  email: string;
  role: keyof typeof ROLES;
  avatarId: string;
  avatar: FileModel;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
};

export type AddUpdateUserModel = {};

export type AddUpdateUserModelResp = {
  message: string;
  user: GetUserModel;
};

export type DeleteUserModelResp = {
  message: string;
};

export type GetUserModel = GetFeatureModel<UserModel, 'user'>;

export type ListUserModel = ListFeatureModel<GetUserModel, 'users'>;
