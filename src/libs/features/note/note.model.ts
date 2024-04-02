import {
  GetFeatureModel,
  GetFeatureProps,
  ListFeatureModel,
  ListFeaturesProps,
} from '~/helpers/shared-model';
import { LectureModel } from '../lecture/lecture.model';
import { UserModel } from '../user/user.model';

export type GetNoteProps = GetFeatureProps;

export type ListNotesProps = ListFeaturesProps & {
  lectureId?: string;
  courseId?: string;
  enable?: boolean;
};

export type NoteModel = {
  _id: string;
  title: string;
  lectureId: string;
  lecture: LectureModel;
  updatedBy: UserModel;
  createdAt: string;
  noteInSecond: number;
  updatedAt: string;
};

export type AddUpdateNoteModel = {
  noteInSecond?: number;
  title: string;
  lectureId?: string;
};

export type AddUpdateNoteModelResp = {
  message: string;
  note: GetNoteModel;
};

export type DeleteNoteModelResp = {
  message: string;
};

export type GetNoteModel = GetFeatureModel<NoteModel, 'note'>;

export type ListNoteModel = ListFeatureModel<NoteModel[], 'notes'>;
