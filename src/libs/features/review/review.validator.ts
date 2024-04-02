import zod from 'zod';
import { ValidatorType } from '~/helpers/shared-model';
import { AddUpdateReviewModel } from './review.model';

export const addUpdateReviewSchema = zod.object<
  ValidatorType<AddUpdateReviewModel>
>({
  msg: zod.string().min(1, '*required'),
  rating: zod.number().max(5).min(0),
  courseId: zod.string().optional(),
});
