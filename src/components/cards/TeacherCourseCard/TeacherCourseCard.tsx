import {
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Image,
  Paper,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useCategory } from '~/features/category/use-category';
import { CourseModel } from '~/features/course/course.model';
import { COURSE_STATUS, COURSE_STATUS_PUBLISHED } from '~/helpers/constants';
import { getCourseCompletePercentage } from '~/helpers/utils';
import classes from './TeacherCourseCard.module.css';

type TeacherCourseCardProps = CourseModel & {};

export default function TeacherCourseCard({
  _id,
  title,
  categoryId,
  ...course
}: TeacherCourseCardProps) {
  const { category } = useCategory({ id: categoryId as string });
  const courseCompleted = useMemo(
    () =>
      getCourseCompletePercentage({
        _id,
        title,
        categoryId,
        ...course,
      }),
    [course]
  );

  return (
    <Paper withBorder className={classes.course_card}>
      <Flex>
        <Box>
          <Image w={180} h={180} src={'/placeholder.jpg'} alt="image" />
        </Box>
        <Stack gap="xs" p="xs" w="100%" pos="relative">
          <Group>
            <Title order={5}>{title}</Title>
            <Badge
              component="span"
              size="xs"
              variant="dot"
              color={
                course?.status == COURSE_STATUS_PUBLISHED ? 'green' : 'orange'
              }
            >
              {COURSE_STATUS[course?.status]}
            </Badge>
          </Group>
          <Text c="dimmed" size="xs">
            {category?.title}
          </Text>
          <Box>
            <Flex align="center" mb="xs">
              <ThemeIcon variant="transparent">
                <IconCheck size="18" />
              </ThemeIcon>
              <Text c="dimmed" size="xs" tt="uppercase">
                Course Progress ({courseCompleted}%)
              </Text>
            </Flex>
            <Progress
              value={courseCompleted}
              striped
              size="sm"
              radius="xl"
              w={'100%'}
            />
          </Box>
          <Button
            variant="subtle"
            component={Link}
            href={`/console/teacher/course/${_id}/manage/goals`}
          >
            Edit / Manager Course
          </Button>
        </Stack>
      </Flex>
    </Paper>
  );
}
