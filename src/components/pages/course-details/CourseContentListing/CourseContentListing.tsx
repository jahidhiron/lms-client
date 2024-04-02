import {
  Accordion,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { AssignmentModel } from '~/features/assignment/assignment.model';
import { CourseModel } from '~/features/course/course.model';
import { LectureModel } from '~/features/lecture/lecture.model';
import { QuizModel } from '~/features/quiz/quiz.model';
import { secondToText } from '~/helpers/utils';
import SectionItem from '../SectionItem';

type CourseContentListingProps = {
  course?: CourseModel;
  openPreview: () => void;
};

export default function CourseContentListing({
  openPreview,
  course,
}: CourseContentListingProps) {
  const [sectionIds, setSectionIds] = useState<string[]>([]);
  const lectureCount = useMemo(
    () =>
      course?.sections
        ?.flatMap((c) => c.items)
        ?.map((item) => item.itemType == 1).length || 0,
    [course]
  );
  return (
    <Box>
      <Title order={3}>Course Content</Title>
      <Flex justify="space-between">
        <Group gap="5" mt="sm">
          <Text size="xs">{course?.sections?.length} Sections</Text>
          <Divider orientation="horizontal" w={5} h={2} bg="dark" />
          <Text size="xs">{lectureCount} Lectures</Text>
          <Divider orientation="horizontal" w={5} h={2} bg="dark" />
          <Text size="xs">
            {secondToText(course?.totalVideoLength || 0)} total length
          </Text>
        </Group>
        <Button
          size="xs"
          variant="subtle"
          onClick={() => {
            if (sectionIds.length == course?.sections?.length) {
              setSectionIds([]);
            } else {
              setSectionIds(course?.sections?.map((sec) => sec._id!) || []);
            }
          }}
        >
          {sectionIds?.length === course?.sections?.length ? 'Hide' : 'Expand'}{' '}
          all section
        </Button>
      </Flex>
      <Accordion
        chevronPosition="left"
        variant="contained"
        mt="xs"
        multiple
        value={sectionIds}
        onChange={(value) => {
          setSectionIds(value);
        }}
      >
        {course?.sections?.map((section, i) => (
          <Accordion.Item
            key={(section?._id || '') + i}
            value={section?._id || ''}
          >
            <Accordion.Control chevron={<IconChevronDown />}>
              <Flex align="center" w="100%" justify="space-between">
                <Group>
                  <Title order={5}>{section?.title}</Title>
                </Group>
                <Group gap="5">
                  <Text size="xs">{section?.items?.length} Lectures</Text>
                  <Divider orientation="horizontal" w={5} h={2} bg="dark" />
                  <Text size="xs">94 Lectures</Text>
                </Group>
              </Flex>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack>
                {section?.items?.map((item, index) => (
                  <SectionItem
                    openPreview={openPreview}
                    key={index}
                    itemType={item.itemType}
                    lecture={item?.lectureId as LectureModel}
                    quiz={item?.quizId as QuizModel}
                    assignment={item?.assignmentId as AssignmentModel}
                  />
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Box>
  );
}
