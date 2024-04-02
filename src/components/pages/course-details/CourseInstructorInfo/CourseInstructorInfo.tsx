import {
  Anchor,
  Avatar,
  Box,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconInbox,
  IconPlayerPlay,
  IconStar,
  IconUsersGroup,
} from '@tabler/icons-react';

type CourseInstructorInfoProps = {};

export default function CourseInstructorInfo({}: CourseInstructorInfoProps) {
  return (
    <div>
      <Title order={3}>Instructor</Title>
      <Box mt="xs">
        <Anchor>
          <Title order={4}>Omar Faruk</Title>
        </Anchor>
        <Text size="md" c="dimmed">
          Software Engineer
        </Text>
        <Flex mt="xs" gap="lg">
          <Avatar size="120" />
          <Stack>
            <Group>
              <IconStar size="20" />
              <Text size="sm">4.5 Instructor Rating</Text>
            </Group>
            <Group>
              <IconInbox size="20" />
              <Text size="sm">20,32 Reviews</Text>
            </Group>
            <Group>
              <IconUsersGroup size="20" />
              <Text size="sm">203,231 Students</Text>
            </Group>
            <Group>
              <IconPlayerPlay size="20" />
              <Text size="sm">23 courses</Text>
            </Group>
          </Stack>
        </Flex>
        <Text size="sm" mt="xs" c="dimmed">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti ad
          molestiae unde? Ipsum unde quisquam ea voluptas, qui obcaecati non
          voluptates, cum inventore illo recusandae mollitia expedita
          consectetur magni officiis.
        </Text>
      </Box>
    </div>
  );
}
