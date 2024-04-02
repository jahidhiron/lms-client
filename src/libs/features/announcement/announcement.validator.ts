import zod from 'zod';
import { AddUpdateAnnouncementModel } from './announcement.model';
import { ValidatorType } from '~/helpers/shared-model';

export const addUpdateAnnouncementSchema = zod.object<ValidatorType<AddUpdateAnnouncementModel>>({

});
