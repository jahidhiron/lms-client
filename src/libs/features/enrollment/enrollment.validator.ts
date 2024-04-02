import zod from 'zod';
import { ValidatorType } from '~/helpers/shared-model';
import { AddUpdateEnrollmentModel } from './enrollment.model';

export const addUpdateEnrollmentSchema = zod.object<
  ValidatorType<AddUpdateEnrollmentModel>
>({
  courseId: zod.string().optional(),
});
