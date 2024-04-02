import zod from 'zod';
import { AddUpdateProductModel } from './product.model';
import { ValidatorType } from '~/helpers/shared-model';
import { zodResolver } from '@mantine/form';

export const addUpdateProductSchema = zodResolver(
  zod.object<ValidatorType<AddUpdateProductModel>>({})
);
