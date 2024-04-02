import {
  GetFeatureModel,
  GetFeatureProps,
  ListFeaturesProps,
} from '~/helpers/shared-model';
import { UserModel } from '../user/user.model';

export type GetProfileProps = GetFeatureProps;

export type ListProfilesProps = ListFeaturesProps;

export type ProfileModel = UserModel & {
  profileId: string;
  profile: {
    _id: string;
    createdAt: string;
    updatedAt: string;
    bio: string;
    facebook: string;
    linkedIn: string;
    title: string;
    twitter: string;
    website: string;
    youtube: string;
  };
};

export type AddUpdateProfileModel = {
  name: string;
  avatarId: string;
  title: string;
  bio: string;
  website: string;
  linkedIn: string;
  facebook: string;
  youtube: string;
  twitter: string;
};

export type AddUpdateProfileModelResp = GetProfileModel;

export type DeleteProfileModelResp = {
  message: string;
};

export type GetProfileModel = GetFeatureModel<ProfileModel, 'userProfile'>;
