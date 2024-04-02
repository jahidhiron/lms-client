import { Stack, Text } from '@mantine/core';
import Image from 'next/image';

type EmptyListContentProps = {
  message: string;
};

export default function EmptyListContent({ message }: EmptyListContentProps) {
  return (
    <Stack align="center" justify="center">
      <Image src="/404-data.svg" width={80} height={100} alt="404" />
      <Text size="xs" c="dimmed">
        {message}
      </Text>
    </Stack>
  );
}
