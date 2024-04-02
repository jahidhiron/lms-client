import { FileWithPath } from '@mantine/dropzone';
import {
  FILE_TYPE_ASSIGNMENT,
  FILE_TYPE_AVATAR,
  FILE_TYPE_DOCUMENT,
  FILE_TYPE_SUBTITLE,
  FILE_TYPE_THUMBNAIL,
  FILE_TYPE_VIDEO,
} from '~/helpers/constants';
import {
  GetFeatureModel,
  GetFeatureProps,
  ListFeatureModel,
  ListFeaturesProps,
} from '~/helpers/shared-model';

export type FILE_TYPE =
  | typeof FILE_TYPE_AVATAR
  | typeof FILE_TYPE_DOCUMENT
  | typeof FILE_TYPE_THUMBNAIL
  | typeof FILE_TYPE_VIDEO
  | typeof FILE_TYPE_ASSIGNMENT
  | typeof FILE_TYPE_SUBTITLE;

export type GetFileProps = GetFeatureProps;

export type ListFilesProps = ListFeaturesProps & {
  type?: FILE_TYPE;
};

export type FileModel = {
  _id: string;
  name: string;
  path: string;
  type: FILE_TYPE;
  size: number;
  mimetype: string;
  timeLength: number;
  updatedBy: string;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AddUpdateFileModel = {
  file: FileWithPath;
  type: FILE_TYPE;
};

export type AddUpdateFileModelResp = GetFileModel;

export type DeleteFileModelResp = {
  message: string;
};

export type GetFileModel = GetFeatureModel<FileModel, 'file'>;

export type ListFileModel = ListFeatureModel<FileModel[], 'files'>;
