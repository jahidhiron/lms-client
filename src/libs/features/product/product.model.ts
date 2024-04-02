import {
  GetFeatureProps,
  GetFeatureModel,
  ListFeatureModel,
  ListFeaturesProps
} from '~/helpers/shared-model';

export type GetProductProps = GetFeatureProps;

export type ListProductsProps = ListFeaturesProps;

export type ProductModel = {

};

export type AddUpdateProductModel = {

};

export type AddUpdateProductModelResp = {
  message: string;
  product: GetProductModel;
};

export type DeleteProductModelResp = {
  message: string;
};

export type GetProductModel = GetFeatureModel<ProductModel, 'product'>;

export type ListProductModel = ListFeatureModel<GetProductModel,'products'>;