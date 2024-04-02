import { zodResolver } from '@mantine/form';
import { AddCourseModel } from './course.model';

import z from 'zod';
import { ValidatorType } from '~/helpers/shared-model';

export const addUpdateCourseSchema = zodResolver(
  z.object<ValidatorType<AddCourseModel>>({
    title: z.string().min(1, '*required'),
    subTitle: z.string().min(1, '*required'),
    categoryId: z.string().min(1, '*required'),
    subCategoryId: z.string().min(1, '*required'),
  })
);
