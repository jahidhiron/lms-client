import zod from 'zod';
import { ValidatorType } from '~/helpers/shared-model';
import { AddUpdateQuizSubmissionModel } from './quizSubmission.model';

export const addUpdateQuizSubmissionSchema = zod.object<
  ValidatorType<AddUpdateQuizSubmissionModel>
>({
  quizId: zod.string(),
  answers: zod.array(zod.any()),
});
