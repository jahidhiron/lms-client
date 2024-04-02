import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  List,
  Paper,
  ScrollArea,
  Spoiler,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconEditCircle, IconTrash } from '@tabler/icons-react';
import EmptyListContent from '~/components/utils/EmptyListContent';
import { AssignmentQuestionModel } from '~/features/assignment/assignment.model';
import useModals from '~/hooks/use-modals';
import useTranslation from '~/hooks/use-translation';
import AssignmentQuestionForm from '../AssignmentQuestionForm';

type AssignmentQuestionsListingProps = {
  questions?: AssignmentQuestionModel[];
  onAdd?: (_question: AssignmentQuestionModel) => void;
  onEdit?: (_question: AssignmentQuestionModel, _questionIndex: number) => void;
  onRemove?: (
    _question: AssignmentQuestionModel,
    _questionIndex: number
  ) => void;
};

export default function AssignmentQuestionsListing({
  questions = [],
  onAdd,
  onEdit,
  onRemove,
}: AssignmentQuestionsListingProps) {
  const { t: commonT } = useTranslation('common');
  const { remove } = useModals();

  const onRemoveHandel = (
    ques: AssignmentQuestionModel,
    questionIndex: number
  ) => {
    remove(commonT('common.words.assignment'), '', () => {
      onRemove?.(ques, questionIndex);
    });
  };

  const onAddHandel = () => {
    modals.open({
      title: 'Add New Question',
      children: (
        <AssignmentQuestionForm
          correctAnswer=""
          title=""
          onSave={(title, correctAnswer) => {
            onAdd?.({ title, correctAnswer });
          }}
          onCancel={() => {
            modals.closeAll();
          }}
        />
      ),
    });
  };

  const onEditHandel = (
    ques: AssignmentQuestionModel,
    questionIndex: number
  ) => {
    modals.open({
      title: 'Edit Question',
      children: (
        <AssignmentQuestionForm
          correctAnswer={ques.correctAnswer}
          title={ques.title}
          onSave={(title, correctAnswer) => {
            onEdit?.({ title, correctAnswer }, questionIndex);
          }}
          onCancel={() => {
            modals.closeAll();
          }}
        />
      ),
    });
  };

  return (
    <Paper mb="xs">
      <Group>
        <Title order={6}>Questions</Title>
        <Button size="xs" variant="outline" onClick={onAddHandel}>
          Add Question
        </Button>
      </Group>

      {questions?.length == 0 ? (
        <EmptyListContent message="No Question Found" />
      ) : (
        <ScrollArea mah={300}>
          <List mt="xs" styles={{ itemWrapper: { width: '100%' } }} w="100%">
            {questions?.map((ques, index) => (
              <List.Item
                key={index}
                styles={{
                  itemIcon: {},
                  itemWrapper: { alignItems: 'flex-start' },
                  itemLabel: { width: '100%' },
                }}
                w="100%"
                icon={<Text mt="md">{index + 1}.</Text>}
              >
                <Flex w="100%" justify="space-between">
                  <Box>
                    <Title order={6} c="dimmed" mb={0}>
                      Question
                    </Title>
                    <Spoiler
                      w={'100%'}
                      style={{ zIndex: 10 }}
                      showLabel="show full question"
                      hideLabel="hide question"
                    >
                      <TypographyStylesProvider pl={0}>
                        <div dangerouslySetInnerHTML={{ __html: ques.title }} />
                      </TypographyStylesProvider>
                    </Spoiler>
                  </Box>
                  <Flex gap="xs" align="center" justify="flex-end">
                    <ActionIcon
                      onClick={() => onEditHandel?.(ques, index)}
                      variant="subtle"
                    >
                      <IconEditCircle size="20" />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => onRemoveHandel(ques, index)}
                      color="red"
                      variant="subtle"
                    >
                      <IconTrash size="20" />
                    </ActionIcon>
                  </Flex>
                </Flex>
                <Box>
                  <Title order={6} c="dimmed">
                    Answer
                  </Title>
                  <Spoiler
                    w={'100%'}
                    style={{ zIndex: 10 }}
                    showLabel="show full answer"
                    hideLabel="hide answer"
                  >
                    <TypographyStylesProvider pl={0}>
                      <div
                        dangerouslySetInnerHTML={{ __html: ques.correctAnswer }}
                      />
                    </TypographyStylesProvider>
                  </Spoiler>
                </Box>
              </List.Item>
            ))}
          </List>
          {/* <Table mt="xs" layout="auto">
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
                <Table.Td
                  pos="sticky"
                  top={0}
                  bg="white"
                  style={{ zIndex: 20 }}
                ></Table.Td>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {questions?.map((ques, index) => (
                <Table.Tr>
                  <Table.Td>{index! + 1}.</Table.Td>
                  <Table.Td>
                    <Accordion w="100%" variant="filled">
                      <Accordion.Item w="100%" value={ques.title}>
                        <Accordion.Control w="100%">
                          <Spoiler
                            style={{ zIndex: 10 }}
                            showLabel="show full question"
                            hideLabel="hide question"
                          >
                            <div
                              dangerouslySetInnerHTML={{ __html: ques.title }}
                            />
                          </Spoiler>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Spoiler
                            style={{ zIndex: 10 }}
                            showLabel="show full question"
                            hideLabel="hide question"
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: ques.correctAnswer,
                              }}
                            />
                          </Spoiler>
                        </Accordion.Panel>
                      </Accordion.Item>
                    </Accordion>
                  </Table.Td>
                  <Table.Td>
                    <Group justify="flex-end">
                      <ActionIcon
                        onClick={() => onEditHandel?.(ques, index)}
                        variant="subtle"
                      >
                        <IconEditCircle size="20" />
                      </ActionIcon>
                      <ActionIcon
                        onClick={() => onRemoveHandel(ques, index)}
                        color="red"
                        variant="subtle"
                      >
                        <IconTrash size="20" />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table> */}
        </ScrollArea>
      )}
    </Paper>
  );
}
