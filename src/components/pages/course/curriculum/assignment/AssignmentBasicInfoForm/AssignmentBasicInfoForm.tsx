import { Button, NumberInput, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import TextEditor from '~/components/core/TextEditor';
import TextInput from '~/components/core/TextInput';
import { UpdateAssignmentModel } from '~/features/assignment/assignment.model';

type AssignmentBasicInfoFormProps = {
  title: string;
  desc: string;
  duration: number;
  onSave: (_title: string, _desc: string, _duration: number | null) => void;
};

export default function AssignmentBasicInfoForm({
  desc,
  title,
  onSave,
  duration,
}: AssignmentBasicInfoFormProps) {
  const form = useForm<
    Pick<UpdateAssignmentModel, 'title' | 'desc' | 'duration'>
  >({
    initialValues: {
      desc,
      title,
      duration,
    },
  });

  useEffect(() => {
    form.setValues({ desc, title, duration });
  }, [desc, title, duration]);
  return (
    <div>
      <Stack mb="md">
        <TextInput label="Title" {...form.getInputProps('title')} />

        <TextEditor
          label="Description"
          value={form.values.desc}
          onChange={(value) => {
            form.setFieldValue('desc', value);
          }}
          withHeading
          withTypography
          withLink
          withImage
          withList
        />

        <NumberInput
          maw={200}
          label="Duration"
          {...form.getInputProps('duration')}
        />
      </Stack>
      <Button
        size="xs"
        disabled={
          desc === form.values.desc &&
          title === form.values.title &&
          duration === form.values.duration
        }
        onClick={() =>
          onSave(form.values.title, form.values.desc, form.values.duration)
        }
      >
        Save
      </Button>
    </div>
  );
}
