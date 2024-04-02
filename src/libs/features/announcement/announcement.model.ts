import {
  GetFeatureModel,
  GetFeatureProps,
  ListFeatureModel,
  ListFeaturesProps,
} from '~/helpers/shared-model';
import { UserModel } from '../user/user.model';

export type GetAnnouncementProps = GetFeatureProps;

export type ListAnnouncementsProps = ListFeaturesProps;

export type AnnouncementCommentModel = {
  title: string;
  updatedBy: UserModel;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type AddAnnouncementCommentModel = {
  title: string;
};

export type UpdateAnnouncementCommentModel = {
  commentId: string;
  title: string;
};

export type AnnouncementModel = {
  _id: string;
  title: string;
  desc: string;
  courseId: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  comments: AnnouncementCommentModel[];
};

export type AddUpdateAnnouncementModel = {};

export type AddUpdateAnnouncementModelResp = {
  message: string;
  announcement: GetAnnouncementModel;
};

export type DeleteAnnouncementModelResp = {
  message: string;
};

export type GetAnnouncementModel = GetFeatureModel<
  AnnouncementModel,
  'announcement'
>;

export type ListAnnouncementModel = ListFeatureModel<
  AnnouncementModel[],
  'announcements'
>;
