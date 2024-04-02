import { zodResolver } from '@mantine/form';
import zod from 'zod';
import { ValidatorType } from '~/helpers/shared-model';
import { AddUpdateProfileModel } from './profile.model';

export const addUpdateProfileSchema = zodResolver(
  zod.object<ValidatorType<AddUpdateProfileModel>>({
    name: zod.string(),
    avatarId: zod.string().optional(),
    youtube: zod.string().optional(),
    linkedIn: zod.string().optional(),
    twitter: zod.string().optional(),
    website: zod.string().url().optional(),
    facebook: zod.string().optional(),
    bio: zod.string(),
    title: zod.string(),
  })
);
