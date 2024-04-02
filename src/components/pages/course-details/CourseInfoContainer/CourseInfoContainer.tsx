import {
  Anchor,
  Badge,
  Group,
  Rating,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconExclamationCircle,
  IconLanguage,
  IconMessage,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { CourseModel } from '~/features/course/course.model';
import { UserModel } from '~/features/user/user.model';

type CourseInfoContainerProps = {
  course?: CourseModel;
};

export default function CourseInfoContainer({
  course,
}: CourseInfoContainerProps) {
  return (
    <Stack gap="xs">
      <Title c="white">{course?.title}</Title>
      <Text size="xl" c="white">
        {course?.subTitle}
      </Text>
      <Group gap="xs">
        <Badge radius="xs">Best Seller</Badge>
        <Rating value={3.4} fractions={2} readOnly />
        <Anchor>(33 ratings)</Anchor>
        <Text c="white">123 students</Text>
      </Group>
      <Group gap="xs">
        <Text c="white" size="sm">
          Created By
        </Text>
        <Anchor size="sm">{(course?.updatedBy as UserModel)?.name}</Anchor>
      </Group>
      <Group gap="sm">
        <Group gap="5">
          <IconExclamationCircle color="white" />
          <Text c="white" size="sm">
            Last Updated {dayjs(course?.updatedAt).format('MM/YYYY')}
          </Text>
        </Group>
        <Group gap="5">
          <IconLanguage color="white" />
          <Text c="white" size="sm">
            {course?.language}
          </Text>
        </Group>
        <Group gap="5">
          <IconMessage color="white" />
          <Text c="white" size="sm">
            English
          </Text>
        </Group>
      </Group>
    </Stack>
  );
}
