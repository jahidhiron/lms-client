import {
  Box,
  Button,
  Flex,
  Group,
  Image,
  Overlay,
  Paper,
  Progress,
  Rating,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlayerPlay } from '@tabler/icons-react';
import Link from 'next/link';
import { useCourse } from '~/features/course/use-course';
import { EnrollmentModel } from '~/features/enrollment/enrollment.model';
import { UserModel } from '~/features/user/user.model';
import { getStaticContentUrl } from '~/helpers/utils';
import classes from './EnrollmentCourseCard.module.css';

type EnrollmentCourseCardProps = {
  enrollment: EnrollmentModel;
};

export const EnrollmentCourseCardPlaceholder = () => (
  <Stack p="xs" gap="xs">
    <Skeleton h={150} />
    <Skeleton h={30} />
    <Skeleton h={10} />
    <Flex gap="sm" justify="space-between">
      <Skeleton h={30} />
      <Skeleton h={30} />
    </Flex>
  </Stack>
);

export default function EnrollmentCourseCard({
  enrollment,
}: EnrollmentCourseCardProps) {
  const [hovered, { open: openOverlay, close: closeOverlay }] =
    useDisclosure(false);
  const { course } = useCourse({
    id: enrollment?.course?.slug,
    isPublic: true,
  });

  return (
    <Paper
      p="xs"
      component={Link}
      href={`/course/${enrollment?.course?.slug}/${
        enrollment._id
      }/lecture/${// @ts-ignore
      course?.sections?.at(0)?.items?.at(0)?.lectureId?._id}/notes`}
      onMouseOver={openOverlay}
      onMouseLeave={closeOverlay}
      className={classes.enrollmentCard}
    >
      <Box pos="relative">
        <Overlay color="white" hidden={!hovered}>
          <Stack align="center" justify="center" h="100%">
            <ThemeIcon size="xl" radius="xl">
              <IconPlayerPlay />
            </ThemeIcon>
          </Stack>
        </Overlay>
        <Image
          w="100%"
          h="200px"
          src={getStaticContentUrl(enrollment?.course?.thumbnail?.path || '')}
          alt={enrollment?.course?._id}
        />
      </Box>
      <Text
        my="5"
        size="lg"
        c={!hovered ? 'dark' : 'orange'}
        lineClamp={2}
        fw="bold"
        lh="xs"
      >
        {enrollment?.course?.title}
      </Text>
      <Text size="xs" c="dimmed">
        {(enrollment?.course?.updatedBy as UserModel)?.name}
      </Text>
      <Box my="xs">
        <Progress value={2} h="4" />
        <Group my="xs" justify="space-between">
          <Button size="xs" variant="light">
            Start Course
          </Button>
          <Box>
            <Rating fractions={2} />
            <Text size="xs" ta="right" mt="3" c="dimmed">
              Leave a rating
            </Text>
          </Box>
        </Group>
      </Box>
    </Paper>
  );
}
