import {
  QUESTION_TYPE_MCQ,
  QUESTION_TYPE_TRUE_FALSE,
} from '~/helpers/constants';
import {
  GetFeatureModel,
  GetFeatureProps,
  ListFeatureModel,
  ListFeaturesProps,
} from '~/helpers/shared-model';
import { CourseModel } from '../course/course.model';
import { UserModel } from '../user/user.model';

export type GetQuizProps = GetFeatureProps;

export type ListQuizzesProps = ListFeaturesProps;

export type QuestionType =
  | typeof QUESTION_TYPE_TRUE_FALSE
  | typeof QUESTION_TYPE_MCQ;

export type OptionModel = { index: number; option: string; explain: string };

export type QuestionModel = {
  questionType: QuestionType;
  title: string;
  options: OptionModel[];
  answer: number[];
  score: number | '';
  _id?: string;
};

export type QuizModel = {
  _id: string;
  title: string;
  desc: string;
  questions: QuestionModel[];
  updatedBy: UserModel;
  createdAt: string;
  updatedAt: string;
  courseId: string;
  course?: CourseModel;
};

export type AddQuizModel = {
  title: string;
  desc: string;
  courseId: string;
};

export type UpdateQuizModel = {
  title: string;
  desc: string;
  courseId: string;
  questions: QuestionModel[];
};

export type AddUpdateQuizModelResp = GetQuizModel;

export type DeleteQuizModelResp = {
  message: string;
};

export type GetQuizModel = GetFeatureModel<QuizModel, 'quiz'>;

export type ListQuizModel = ListFeatureModel<QuizModel[], 'quizzes'>;
