import { Button, Menu } from '@mantine/core';
import {
  IconBoxMultiple4,
  IconMessagePlus,
  IconQuestionMark,
} from '@tabler/icons-react';
import { QuestionType } from '~/features/quiz/quiz.model';
import {
  QUESTION_TYPE_MCQ,
  QUESTION_TYPE_TRUE_FALSE,
} from '~/helpers/constants';

type AddQuestionButtonProps = {
  onPress?: (_questionType: QuestionType) => void;
};

export default function AddQuestionButton({ onPress }: AddQuestionButtonProps) {
  return (
    <Menu>
      <Menu.Target>
        <Button
          variant="subtle"
          size="xs"
          leftSection={<IconMessagePlus size="15" />}
        >
          Add New Question
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconQuestionMark />}
          onClick={() => onPress?.(QUESTION_TYPE_TRUE_FALSE)}
        >
          True / False
        </Menu.Item>
        <Menu.Item
          leftSection={<IconBoxMultiple4 />}
          onClick={() => onPress?.(QUESTION_TYPE_MCQ)}
        >
          Multiple Choice
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
