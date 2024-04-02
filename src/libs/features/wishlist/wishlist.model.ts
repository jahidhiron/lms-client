import {
  GetFeatureModel,
  GetFeatureProps,
  ListFeatureModel,
  ListFeaturesProps,
} from '~/helpers/shared-model';
import { CartModel } from '../cart/cart.model';

export type GetWishlistProps = GetFeatureProps;

export type ListWishlistsProps = ListFeaturesProps;

export type WishlistModel = CartModel;

export type AddUpdateWishlistModel = {
  courseId: string;
};

export type AddUpdateWishlistModelResp = {
  message: string;
  wishlist: GetWishlistModel;
};

export type DeleteWishlistModelResp = {
  message: string;
};

export type GetWishlistModel = GetFeatureModel<WishlistModel, 'wishlist'>;

export type ListWishlistModel = ListFeatureModel<WishlistModel[], 'wishlists'>;
