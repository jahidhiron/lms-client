import zod from 'zod';
import { ValidatorType } from '~/helpers/shared-model';
import { AddUpdateNoteModel } from './note.model';

export const addUpdateNoteSchema = zod.object<
  ValidatorType<AddUpdateNoteModel>
>({
  title: zod.string(),
});
