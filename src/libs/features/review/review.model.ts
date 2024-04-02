import {
  GetFeatureModel,
  GetFeatureProps,
  ListFeatureModel,
  ListFeaturesProps,
} from '~/helpers/shared-model';
import { CourseModel } from '../course/course.model';
import { UserModel } from '../user/user.model';

export type GetReviewProps = GetFeatureProps;

export type ListReviewsProps = ListFeaturesProps & {
  courseId?: string;
  rating?: string;
};

export type ReviewModel = {
  _id: string;
  msg: string;
  courseId: string;
  rating: number;
  updatedBy: UserModel;
  createdAt: string;
  updatedAt: string;
  course: CourseModel;
};

export type AddUpdateReviewModel = {
  msg: string;
  rating: number;
  courseId: string;
};

export type AddUpdateReviewModelResp = {
  message: string;
  review: GetReviewModel;
};

export type DeleteReviewModelResp = {
  message: string;
};

export type GetReviewModel = GetFeatureModel<ReviewModel, 'review'>;

export type ListReviewModel = ListFeatureModel<ReviewModel, 'reviews'>;
