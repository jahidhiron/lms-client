import {
  Accordion,
  Group,
  Stack,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconPlayerPlayFilled } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useEnrollment } from '~/features/enrollment/use-enrollment';
import SectionItem from '../SectionItem';

type CourseViewSidebarProps = {};

export default function CourseViewSidebar({}: CourseViewSidebarProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const { eId, itemId } = router.query;
  const { enrollment } = useEnrollment({ id: eId as string });
  const [actionSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    enrollment?.course?.sections.forEach((sec) => {
      sec.items.forEach((item) => {
        if (
          item.lectureId == itemId ||
          item?.quizId == itemId ||
          item?.assignmentId
        ) {
          setActiveSection(sec._id || null);
          setActiveSectionId(sec._id || null);
        }
      });
    });
  }, [enrollment, itemId]);

  return (
    <Stack pos="relative">
      <Accordion
        variant="contained"
        value={activeSection}
        onChange={(value) => {
          setActiveSection(value);
        }}
      >
        {enrollment?.course?.sections?.map((section, index) => (
          <Accordion.Item value={section?._id || ''} key={index}>
            <Accordion.Control>
              <Group>
                <Title order={6}>
                  Section {index + 1}: {section?.title}
                </Title>
                {actionSectionId == section?._id && (
                  <ThemeIcon variant="transparent">
                    <IconPlayerPlayFilled size="15" />
                  </ThemeIcon>
                )}
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack>
                {section?.items?.map((item, itemIndex) => (
                  <SectionItem
                    key={
                      (item.lectureId as string) ||
                      (item.quizId as string) ||
                      (item?.assignmentId as string) ||
                      itemIndex?.toString()
                    }
                    active={
                      item?.lectureId === itemId ||
                      item?.quizId === itemId ||
                      item?.assignmentId === itemId
                    }
                    index={itemIndex}
                    lecture={item?.lecture}
                    quiz={item?.quiz}
                    assignment={item?.assignment}
                  />
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Stack>
  );
}
