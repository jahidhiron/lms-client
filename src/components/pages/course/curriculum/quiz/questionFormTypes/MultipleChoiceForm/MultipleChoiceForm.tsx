import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Paper,
  Radio,
  RadioGroup,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowsVertical, IconTrash } from '@tabler/icons-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import SortableList from '~/components/core/SortableList';
import SortableItem from '~/components/core/SortableList/components/SortableItem';
import TextEditor from '~/components/core/TextEditor';
import TextInput from '~/components/core/TextInput';
import { QuestionModel } from '~/features/quiz/quiz.model';
import { questionSchema } from '~/features/quiz/quiz.validator';
import { EXPLAIN_MAX_CHAR, QUESTION_TYPE_MCQ } from '~/helpers/constants';
import { nanoNumber } from '~/helpers/utils';

type MultipleChoiceFormProps = {
  onCancel: () => void;
  onSave: (_question: QuestionModel) => void;
  question: QuestionModel | null;
};

export default function MultipleChoiceForm({
  onSave,
  onCancel,
  question,
}: MultipleChoiceFormProps) {
  const form = useForm<QuestionModel>({
    validate: questionSchema,
    initialValues: {
      title: '',
      options: [
        {
          option: '',
          explain: '',
          index: nanoNumber(),
        },
      ],
      answer: [],
      questionType: QUESTION_TYPE_MCQ,
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
        questionType: question?.questionType || QUESTION_TYPE_MCQ,
        options: question?.options,
        answer: question?.answer,
      });
    }
  }, [question]);

  return (
    <Box>
      <Text size="sm" fw="bold" c="gray" mb="xs">
        Question (Multiple Choice)
      </Text>
      <TextEditor
        value={form.values.title}
        onChange={(html) => {
          form.setFieldValue('title', html);
        }}
        withTypography
      />
      {form.errors?.title && <Text c="red">{form.errors?.title}</Text>}
      <Group justify="flex-start" mt="xs">
        {/* <TextInput
          label={'Score'}
          labelProps={{ c: 'dimmed', fw: 'bold', size: 'xs' }}
          type="number"
          hidden
          {...form.getInputProps('score')}
        /> */}
      </Group>
      <Text size="sm" fw="bold" c="gray" mt="xs">
        Select Answer
      </Text>
      {typeof form.errors?.options === 'string' && (
        <Text size="xs" c="red">
          {form.errors?.options}
        </Text>
      )}
      <RadioGroup
        // @ts-ignore
        value={form.values.answer?.[0] || ''}
        onChange={(value) => {
          form.setFieldValue('answer.0', parseInt(value));
        }}
      >
        <SortableList
          items={form.values.options}
          getItemId={(item) => item.index.toString()}
          onChange={(items) => {
            form.setFieldValue('options', items);
          }}
          renderItem={(item, index, getItemId) => (
            <SortableItem key={getItemId?.(item)} id={getItemId?.(item)!}>
              <Flex gap="xs">
                <Box w="100%" py="xs">
                  <TextInput
                    {...form.getInputProps(`options.${index}.option`)}
                    leftSection={<Radio value={item.index} />}
                  />
                  <Paper mt="xs" pl="xl">
                    <TextInput
                      withCount
                      maxLength={EXPLAIN_MAX_CHAR}
                      placeholder="Explain why it's right or wrong"
                      {...form.getInputProps(`options.${index}.explain`)}
                    />
                  </Paper>
                </Box>
                <Flex gap="xs" align="center" justify="center">
                  <ActionIcon
                    size="md"
                    color="red"
                    onClick={() => {
                      if (form.values.options.length > 1) {
                        form.removeListItem('options', index!);
                      }
                    }}
                  >
                    <IconTrash size="15" />
                  </ActionIcon>
                  <SortableList.DragHandle>
                    <ActionIcon size="md">
                      <IconArrowsVertical size="15" />
                    </ActionIcon>
                  </SortableList.DragHandle>
                </Flex>
              </Flex>
              {index! + 1 !== form.values.options.length && <Divider />}{' '}
            </SortableItem>
          )}
        />
        <Group>
          <Button
            onClick={() => {
              form.insertListItem('options', {
                option: '',
                explain: '',
                index: nanoNumber(),
              } satisfies QuestionModel['options'][0]);
            }}
            size="xs"
          >
            Add New Option
          </Button>
        </Group>
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
