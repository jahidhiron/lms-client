import {
  GetFeatureModel,
  GetFeatureProps,
  ListFeatureModel,
  ListFeaturesProps,
} from '~/helpers/shared-model';
import { UserModel } from '../user/user.model';

export type GetCategoryProps = GetFeatureProps;

export type ListCategoriesProps = ListFeaturesProps;

export type CategoryModel = {
  _id: string;
  title: string;
  desc: string;
  updatedBy: UserModel;
  createdAt: string;
  updatedAt: string;
};

export type AddUpdateCategoryModel = {};

export type AddUpdateCategoryModelResp = {
  message: string;
  category: GetCategoryModel;
};

export type DeleteCategoryModelResp = {
  message: string;
};

export type GetCategoryModel = GetFeatureModel<CategoryModel, 'category'>;

export type ListCategoryModel = ListFeatureModel<CategoryModel, 'categories'>;
