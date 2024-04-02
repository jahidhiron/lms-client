import {
  GetFeatureModel,
  GetFeatureProps,
  ListFeatureModel,
  ListFeaturesProps,
} from '~/helpers/shared-model';
import { FileModel } from '../file/file.model';
import { UserModel } from '../user/user.model';

export type GetLectureProps = GetFeatureProps & {
  isPublic?: boolean;
};

export type ListLecturesProps = ListFeaturesProps;

export type LectureResourceModel = {
  title: string;
  fileId?: string;
  file?: FileModel;
  link?: string;
  _id?: string;
};

export type LectureModel = {
  _id: string;
  title: string;
  slug: string;
  desc: string;
  preview: boolean;
  resources: LectureResourceModel[];
  updatedBy: UserModel;
  createdAt: string;
  updatedAt: string;
  video: FileModel;
  videoId: string | FileModel;
  updatedByAdmin: {};
};

export type AddLectureModel = {
  title: string;
};

export type UpdateLectureModel = {
  title?: string;
  desc?: string;
  preview?: boolean;
  videoId?: string;
  resources?: LectureResourceModel[];
};

export type AddUpdateLectureModelResp = GetFeatureModel<
  LectureModel,
  'lecture'
>;

export type DeleteLectureModelResp = {
  message: string;
};

export type GetLectureModel = GetFeatureModel<LectureModel, 'lecture'>;

export type ListLectureModel = ListFeatureModel<LectureModel[], 'lectures'>;
