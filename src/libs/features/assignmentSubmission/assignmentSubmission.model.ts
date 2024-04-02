import { ASSIGNMENT_DRAFT, ASSIGNMENT_SUBMITTED } from '~/helpers/constants';
import {
  GetFeatureModel,
  GetFeatureProps,
  ListFeatureModel,
  ListFeaturesProps,
} from '~/helpers/shared-model';
import { AssignmentModel } from '../assignment/assignment.model';
import { UserModel } from '../user/user.model';

export type GetAssignmentSubmissionProps = GetFeatureProps;

export type ListAssignmentSubmissionsProps = ListFeaturesProps;

export type AssignmentSubmissionStatus =
  | typeof ASSIGNMENT_DRAFT
  | typeof ASSIGNMENT_SUBMITTED;

export type AssignmentSubmissionModel = {
  _id: string;
  assignmentId: string;
  answers: AssignmentAnswerModel[];
  status: AssignmentSubmissionStatus;
  createdAt: string;
  updatedBy: UserModel;
  updatedAt: string;
  assignment: AssignmentModel;
};

export type AssignmentAnswerModel = {
  title: string;
  correctAnswer: string;
  answerProvided: string;
};

export type AddUpdateAssignmentSubmissionModel = {
  assignmentId: string;
  status: AssignmentSubmissionStatus;
  answers: AssignmentAnswerModel[];
};

export type AddUpdateAssignmentSubmissionModelResp = {
  message: string;
  data: {
    assignmentAnswer: AssignmentSubmissionModel;
  };
};

export type DeleteAssignmentSubmissionModelResp = {
  message: string;
};

export type GetAssignmentSubmissionModel = GetFeatureModel<
  AssignmentSubmissionModel,
  'assignmentAnswer'
>;

export type ListAssignmentSubmissionModel = ListFeatureModel<
  AssignmentSubmissionModel[],
  'assignmentAnswers'
>;
