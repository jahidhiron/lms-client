import {
  GetFeatureModel,
  ListFeatureModel,
  ListFeaturesProps,
} from '~/helpers/shared-model';
import { CourseModel } from '../course/course.model';
import { OptionModel, QuizModel } from '../quiz/quiz.model';
import { UserModel } from '../user/user.model';

export type GetQuizSubmissionProps = {
  quizId: string;
};

export type ListQuizSubmissionsProps = ListFeaturesProps;

export type QuizAnswerModel = {
  question: string;
  match: true;
  options: OptionModel[];
  correctAnswer: number[];
  answerProvided: number[];
  _id: string;
};

export type QuizSubmissionModel = {
  _id: string;
  answer: QuizAnswerModel[];
  totalScore: number;
  totalAcquireScore: number;
  updatedBy: UserModel;
  createdAt: string;
  updatedAt: string;
  quiz: QuizModel;
  course: CourseModel;
};

export type AddUpdateQuizSubmissionModel = {
  quizId: string;
  answers: {
    questionId: string;
    answerProvided: number[];
  }[];
};
export type AddUpdateQuizSubmissionModelResp = {
  message: string;
  quizSubmission: GetQuizSubmissionModel;
};

export type DeleteQuizSubmissionModelResp = {
  message: string;
};

export type GetQuizSubmissionModel = GetFeatureModel<
  QuizSubmissionModel,
  'quizAnswer'
>;

export type ListQuizSubmissionModel = ListFeatureModel<
  GetQuizSubmissionModel,
  'quizSubmissions'
>;
