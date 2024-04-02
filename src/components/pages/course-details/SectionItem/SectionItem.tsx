import { ActionIcon, Box, Button, Flex, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// import classes from './SectionItem.module.css';
import { IconChevronDown, IconChevronUp, IconVideo } from '@tabler/icons-react';
import { AssignmentModel } from '~/features/assignment/assignment.model';
import { SectionItemType } from '~/features/course/course.model';
import { FileModel } from '~/features/file/file.model';
import { LectureModel } from '~/features/lecture/lecture.model';
import { QuizModel } from '~/features/quiz/quiz.model';
import {
  SECTION_ITEM_ASSIGNMENT,
  SECTION_ITEM_LECTURE,
  SECTION_ITEM_QUIZ,
} from '~/helpers/constants';
import { secondToText } from '~/helpers/utils';

type SectionItemProps = {
  itemType: SectionItemType;
  quiz?: QuizModel;
  lecture?: LectureModel;
  assignment?: AssignmentModel;
  openPreview: () => void;
};

export default function SectionItem({
  lecture,
  quiz,
  assignment,
  itemType,
  openPreview,
}: SectionItemProps) {
  const [showDesc, { toggle }] = useDisclosure();
  const item = {
    [SECTION_ITEM_LECTURE]: lecture,
    [SECTION_ITEM_QUIZ]: quiz,
    [SECTION_ITEM_ASSIGNMENT]: assignment,
  }[itemType];
  const lectureTimePreview =
    itemType == SECTION_ITEM_LECTURE ? (
      <>
        {(item as LectureModel)?.preview ? (
          <Button variant="subtle" size="xs" onClick={openPreview}>
            Preview
          </Button>
        ) : null}
        <Text size="sm" c="dimmed">
          {secondToText(
            ((item as LectureModel)?.videoId as FileModel)?.timeLength || 0
          )}
        </Text>
      </>
    ) : (
      <></>
    );
  return (
    <Box>
      <Flex align="center" justify="space-between">
        <Group>
          <IconVideo size="15" />
          <Box>
            <Text size="sm">{item?.title}</Text>
          </Box>
          <ActionIcon variant="light" size="xs" onClick={toggle}>
            {showDesc ? <IconChevronUp /> : <IconChevronDown />}
          </ActionIcon>
        </Group>
        <Group>{lectureTimePreview}</Group>
      </Flex>
      {showDesc && (
        <Text pl="xl" mt="xs" size="xs" c="dimmed">
          {item?.desc}
        </Text>
      )}
    </Box>
  );
}
