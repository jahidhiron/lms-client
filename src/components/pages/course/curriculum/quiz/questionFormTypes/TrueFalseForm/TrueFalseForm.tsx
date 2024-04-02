import {
  Box,
  Button,
  Group,
  Paper,
  Radio,
  RadioGroup,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import TextEditor from '~/components/core/TextEditor';
import TextInput from '~/components/core/TextInput';
import { QuestionModel } from '~/features/quiz/quiz.model';
import { questionSchema } from '~/features/quiz/quiz.validator';
import {
  EXPLAIN_MAX_CHAR,
  QUESTION_TYPE_TRUE_FALSE,
} from '~/helpers/constants';

type TrueFalseFormProps = {
  onCancel: () => void;
  onSave: (_question: QuestionModel) => void;
  question: QuestionModel | null;
};

export default function TrueFalseForm({
  onCancel,
  onSave,
  question,
}: TrueFalseFormProps) {
  const form = useForm<QuestionModel>({
    validate: questionSchema,
    initialValues: {
      title: '',
      options: [
        {
          option: 'True',
          explain: '',
          index: 0,
        },
        {
          option: 'False',
          explain: '',
          index: 1,
        },
      ],
      answer: [],
      questionType: QUESTION_TYPE_TRUE_FALSE,
      score: '',
    },
  });

  const onSubmit = () => {
    const res = form.validate();
    if (res.hasErrors) {
      return;
    }
    if (form.values.answer.length == 0) {
      toast.error('No answer selected');
      return;
    }
    onSave({ ...form.values, _id: question?._id });
  };

  useEffect(() => {
    if (question != null) {
      form.setValues({
        title: question?.title,
        score: question?.score,
        questionType: question?.questionType || QUESTION_TYPE_TRUE_FALSE,
        options: question?.options,
        answer: question?.answer,
      });
    }
  }, [question]);

  return (
    <Box>
      <Text size="xs" fw="bold" c="gray" mb="xs">
        Question
      </Text>
      <TextEditor
        value={form.values.title}
        onChange={(html) => {
          form.setFieldValue('title', html);
        }}
        withTypography
        withImage
      />
      <Group justify="flex-start" mt="xs">
        <TextInput
          label="Score"
          labelProps={{ c: 'dimmed', fw: 'bold', size: 'xs' }}
          type="number"
          {...form.getInputProps('score')}
        />
      </Group>

      <Text size="xs" fw="bold" c="gray" mt="xs">
        Select Answer
      </Text>
      <RadioGroup
        // @ts-ignore
        value={form.values.answer?.at(0)}
        onChange={(value) => {
          form.setFieldValue('answer.0', parseInt(value));
        }}
      >
        {form.values.options.map((opt, index) => (
          <Box py="xs" key={opt.index}>
            <Paper withBorder p="xs">
              <Radio value={opt.index} label={opt.option} />
            </Paper>
            <Paper mt="xs" pl="xl">
              <TextInput
                withCount
                maxLength={EXPLAIN_MAX_CHAR}
                placeholder="Explain why it's right or wrong"
                {...form.getInputProps(`options.${index}.explain`)}
              />
            </Paper>
          </Box>
        ))}
      </RadioGroup>
      <Group justify="flex-end">
        <Button color="dark" variant="outline" size="xs" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="xs" onClick={onSubmit}>
          Save
        </Button>
      </Group>
    </Box>
  );
}
