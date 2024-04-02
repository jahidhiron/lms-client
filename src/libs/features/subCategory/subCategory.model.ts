import {
  GetFeatureModel,
  GetFeatureProps,
  ListFeatureModel,
  ListFeaturesProps,
} from '~/helpers/shared-model';
import { CategoryModel } from '../category/category.model';
import { UserModel } from '../user/user.model';

export type GetSubCategoryProps = GetFeatureProps;

export type ListSubCategoriesProps = ListFeaturesProps & {
  categoryId?: string;
};

export type SubCategoryModel = {
  _id: string;
  title: string;
  desc: string;
  updatedBy: UserModel;
  createdAt: string;
  updatedAt: string;
  category: CategoryModel;
};

export type AddUpdateSubCategoryModel = {};

export type AddUpdateSubCategoryModelResp = {
  message: string;
  subCategory: GetSubCategoryModel;
};

export type DeleteSubCategoryModelResp = {
  message: string;
};

export type GetSubCategoryModel = GetFeatureModel<
  SubCategoryModel,
  'subCategory'
>;

export type ListSubCategoryModel = ListFeatureModel<
  SubCategoryModel,
  'subCategories'
>;
