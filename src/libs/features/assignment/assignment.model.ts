import {
  GetFeatureModel,
  GetFeatureProps,
  ListFeatureModel,
  ListFeaturesProps,
} from '~/helpers/shared-model';
import { FileModel } from '../file/file.model';

export type GetAssignmentProps = GetFeatureProps;

export type ListAssignmentsProps = ListFeaturesProps;

export type AssignmentQuestionModel = {
  title: string;
  correctAnswer: string;
};

export type AssignmentModel = {
  _id: string;

  title: string;
  courseId: string;
  desc: string;
  duration: number;
  instructionDesc: string;

  instructionVideoId: string;
  instructionVideo?: FileModel;
  instructionFileId: string;
  instructionFile?: FileModel;
  solutionVideoId: string;
  solutionVideo: FileModel;
  solutionFileId: string;
  solutionFile?: FileModel;
  questions: AssignmentQuestionModel[];
};

export type AddAssignmentModel = {
  title: string;
  courseId: string;
};

export type UpdateAssignmentModel = {
  title: string;
  courseId: string;
  desc: string;
  duration: number | null;
  instructionVideoId: string | null;
  instructionDesc: string | null;
  instructionFileId: string | null;
  solutionVideoId: string | null;
  solutionFileId: string | null;
  questions: AssignmentQuestionModel[];
};

export type AddUpdateAssignmentModelResp = GetAssignmentModel;

export type DeleteAssignmentModelResp = {
  message: string;
};

export type GetAssignmentModel = GetFeatureModel<AssignmentModel, 'assignment'>;

export type ListAssignmentModel = ListFeatureModel<
  AssignmentModel[],
  'assignments'
>;
