import zod from 'zod';
import { AddUpdateSubCategoryModel } from './subCategory.model';
import { ValidatorType } from '~/helpers/shared-model';

export const addUpdateSubCategorySchema = zod.object<ValidatorType<AddUpdateSubCategoryModel>>({

});
