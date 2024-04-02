import zod from 'zod';
import { ValidatorType } from '~/helpers/shared-model';
import { AddUpdateAssignmentSubmissionModel } from './assignmentSubmission.model';

export const addUpdateAssignmentSubmissionSchema = zod.object<
  ValidatorType<AddUpdateAssignmentSubmissionModel>
>({
  assignmentId: zod.string(),
  answers: zod
    .array(
      zod.object<
        ValidatorType<AddUpdateAssignmentSubmissionModel['answers'][0]>
      >({
        answerProvided: zod.string().min(1, '*required'),
        correctAnswer: zod.string().min(1, '*required'),
        title: zod.string().min(1, '*required'),
      })
    )
    .min(1),
  status: zod.number(),
});
