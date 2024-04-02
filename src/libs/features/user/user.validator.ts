import zod from 'zod';
import { AddUpdateUserModel } from './user.model';
import { ValidatorType } from '~/helpers/shared-model';

export const addUpdateUserSchema = zod.object<ValidatorType<AddUpdateUserModel>>({

});
