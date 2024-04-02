import { Button, RingProgress, Stack, Text, Title } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { useEffect, useState } from 'react';

type RingIntervalProps = {
  countdownFrom: number;
  label: string;
  onDone: () => void;
  onCancel: () => void;
};

export default function RingInterval({
  countdownFrom,
  label,
  onDone,
  onCancel,
}: RingIntervalProps) {
  const [count, setCount] = useState(countdownFrom);
  const percent = (100 * (countdownFrom - count)) / countdownFrom;
  const interval = useInterval(() => {
    setCount((prev) => prev - 1 / 100);
  }, 10);

  useEffect(() => {
    if (!interval.active) {
      interval.start();
    }
  }, []);

  useEffect(() => {
    if (count <= 0) {
      onDone();
      interval.stop();
    }
  }, [count]);

  return (
    <Stack>
      <Text ta="center" c="white">
        Up Next
      </Text>
      <Title order={5} ta="center" c="white">
        {label}
      </Title>
      <RingProgress
        sections={[{ color: 'orange', value: percent }]}
        label={
          <Text
            size="xl"
            fw="bold"
            ta="center"
            px="xs"
            c="white"
            style={{ pointerEvents: 'none' }}
          >
            {Math.abs(count).toFixed(1)}
          </Text>
        }
        thickness={3}
        onClick={() => {
          setCount(countdownFrom);
          interval.start();
        }}
      />
      <Button
        variant="transparent"
        c="white"
        onClick={() => {
          interval.stop();
          setCount(countdownFrom);
          onCancel();
        }}
      >
        Cancel
      </Button>
    </Stack>
  );
}
