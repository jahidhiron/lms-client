import {
  ActionIcon,
  Group,
  Paper,
  ScrollArea,
  Spoiler,
  Table,
  Text,
} from '@mantine/core';
import {
  IconArrowsVertical,
  IconEditCircle,
  IconTrash,
} from '@tabler/icons-react';
import SortableList from '~/components/core/SortableList';
import SortableItem from '~/components/core/SortableList/components/SortableItem';
import EmptyListContent from '~/components/utils/EmptyListContent';
import { QuestionModel, QuestionType } from '~/features/quiz/quiz.model';
import {
  QUESTION_TYPE_MCQ,
  QUESTION_TYPE_TRUE_FALSE,
} from '~/helpers/constants';
import AddQuestionButton from '../AddQuestionButton';

type QuestionListingsProps = {
  questions?: QuestionModel[];
  onAdd?: (_questionType: QuestionType) => void;
  onEdit?: (_question: QuestionModel) => void;
  onRemove?: (_question: QuestionModel) => void;
  onReorder: (_questions: QuestionModel[]) => void;
};

export default function QuestionListings({
  questions = [],
  onAdd,
  onEdit,
  onRemove,
  onReorder,
}: QuestionListingsProps) {
  return (
    <Paper py="sm">
      <Group>
        <Text c="dimmed">Questions</Text>
        <AddQuestionButton onPress={onAdd} />
      </Group>

      {questions?.length == 0 ? (
        <EmptyListContent message="No Question Found" />
      ) : (
        <ScrollArea mah={300}>
          <Table mt="xs">
            <Table.Thead>
              <Table.Tr>
                <Table.Td
                  pos="sticky"
                  top={0}
                  bg="white"
                  style={{ zIndex: 20 }}
                >
                  #
                </Table.Td>
                <Table.Th
                  pos="sticky"
                  top={0}
                  bg="white"
                  style={{ zIndex: 20 }}
                >
                  Title
                </Table.Th>
                <Table.Th
                  pos="sticky"
                  top={0}
                  bg="white"
                  style={{ zIndex: 20 }}
                >
                  Type
                </Table.Th>
                <Table.Td
                  pos="sticky"
                  top={0}
                  bg="white"
                  style={{ zIndex: 20 }}
                ></Table.Td>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <SortableList
                view="table"
                onChange={onReorder!}
                items={questions}
                getItemId={(ques) => ques._id!}
                renderItem={(ques, index, getItemId) => (
                  <SortableItem
                    component={Table.Tr}
                    key={getItemId?.(ques)}
                    id={getItemId?.(ques)!}
                  >
                    <Table.Td>{index! + 1}.</Table.Td>
                    <Table.Td>
                      <Spoiler
                        style={{ zIndex: 10 }}
                        showLabel="show full question"
                        hideLabel="hide question"
                      >
                        <div dangerouslySetInnerHTML={{ __html: ques.title }} />
                      </Spoiler>
                    </Table.Td>
                    <Table.Td>
                      {
                        {
                          [QUESTION_TYPE_TRUE_FALSE]: 'True / False',
                          [QUESTION_TYPE_MCQ]: 'Multiple Choice',
                        }[ques.questionType]
                      }
                    </Table.Td>
                    <Table.Td>
                      <Group justify="flex-end">
                        <ActionIcon
                          onClick={() => onEdit?.(ques)}
                          variant="subtle"
                        >
                          <IconEditCircle size="20" />
                        </ActionIcon>
                        <ActionIcon
                          onClick={() => onRemove?.(ques)}
                          color="red"
                          variant="subtle"
                        >
                          <IconTrash size="20" />
                        </ActionIcon>
                        <SortableList.DragHandle>
                          <ActionIcon variant="subtle">
                            <IconArrowsVertical size="20" />
                          </ActionIcon>
                        </SortableList.DragHandle>
                      </Group>
                    </Table.Td>
                  </SortableItem>
                )}
              />
              {/* {questions?.map((ques, index) => (
                <Table.Tr key={ques._id}>
                  <Table.Td>{index + 1}.</Table.Td>
                  <Table.Td>
                    <Spoiler
                      style={{ zIndex: 10 }}
                      showLabel="show full question"
                      hideLabel="hide question"
                    >
                      <div dangerouslySetInnerHTML={{ __html: ques.title }} />
                    </Spoiler>
                  </Table.Td>
                  <Table.Td>
                    {
                      {
                        [QUESTION_TYPE_TRUE_FALSE]: 'True / False',
                        [QUESTION_TYPE_MCQ]: 'Multiple Choice',
                      }[ques.questionType]
                    }
                  </Table.Td>
                  <Table.Td>
                    <Group justify="flex-end">
                      <ActionIcon
                        onClick={() => onEdit?.(ques)}
                        variant="subtle"
                      >
                        <IconEditCircle size="20" />
                      </ActionIcon>
                      <ActionIcon
                        onClick={() => onRemove?.(ques)}
                        color="red"
                        variant="subtle"
                      >
                        <IconTrash size="20" />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))} */}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}
    </Paper>
  );
}
