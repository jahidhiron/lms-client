import { zodResolver } from '@mantine/form';
import zod from 'zod';
import { ValidatorType } from '~/helpers/shared-model';
import { OptionModel, QuestionModel } from './quiz.model';

const optionSchema = zod.object<ValidatorType<OptionModel>>({
  explain: zod.string(),
  option: zod.string().min(1, '*required'),
  index: zod.number(),
});

export const questionSchema = zodResolver(
  zod.object<ValidatorType<QuestionModel>>({
    title: zod.string().min(1, '*required'),
    answer: zod.array(zod.number()),
    options: zod
      .array(optionSchema)
      .min(1)
      .refine(
        (options) => {
          const optionSet = new Set(options.map((option) => option.option));
          return optionSet.size === options.length;
        },
        {
          message: 'Options must be unique',
        }
      ),
    questionType: zod.union([zod.number(), zod.string()]),
    score: zod.string().optional().nullable(),
  })
);
