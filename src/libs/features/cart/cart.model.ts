import {
  GetFeatureModel,
  GetFeatureProps,
  ListFeatureModel,
  ListFeaturesProps,
} from '~/helpers/shared-model';
import { CourseModel } from '../course/course.model';
import { UserModel } from '../user/user.model';

export type GetCartProps = GetFeatureProps;

export type ListCartsProps = ListFeaturesProps;

export type CartModel = {
  _id: string;
  updatedBy: UserModel;
  createdAt: string;
  updatedAt: string;
  course: CourseModel;
};
export type AddUpdateCartModel = {
  courseId: string;
};

export type AddUpdateCartModelResp = {
  message: string;
  cart: GetCartModel;
};

export type DeleteCartModelResp = {
  message: string;
};

export type GetCartModel = GetFeatureModel<CartModel, 'addToCard'>;

export type ListCartModel = ListFeatureModel<CartModel[], 'addToCards'>;
