import zod from 'zod';
import { ValidatorType } from '~/helpers/shared-model';
import { AddUpdateCategoryModel } from './category.model';

export const addUpdateCategorySchema = zod.object<
  ValidatorType<AddUpdateCategoryModel>
>({});
