import { Avatar, Flex, Group, Rating, Stack, Text, Title } from '@mantine/core';
import { ReviewModel } from '~/features/review/review.model';
import { convertToHumanReadable } from '~/helpers/utils';

type CourseReviewItemProps = {
  review?: ReviewModel;
};

export default function CourseReviewItem({ review }: CourseReviewItemProps) {
  return (
    <Flex gap="md">
      <Avatar bg="dark">OF</Avatar>
      <Stack gap="4">
        <Title order={5}>{review?.updatedBy?.name}</Title>
        <Group>
          <Rating readOnly value={review?.rating} />
          <Text>{convertToHumanReadable(review?.createdAt!)}</Text>
        </Group>
        <Text size="md">{review?.msg}</Text>
      </Stack>
    </Flex>
  );
}
