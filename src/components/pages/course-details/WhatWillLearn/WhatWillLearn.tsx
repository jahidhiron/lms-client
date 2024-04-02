import {
  Button,
  Group,
  Paper,
  SimpleGrid,
  Spoiler,
  Text,
  Title,
} from '@mantine/core';
import { IconCheck, IconChevronDown, IconChevronUp } from '@tabler/icons-react';

type WhatWillLearnProps = {
  whatWillLearn: string[];
};

export default function WhatWillLearn({ whatWillLearn }: WhatWillLearnProps) {
  return (
    <Paper withBorder p="lg">
      <Title order={3}>What you&apos;ll learn</Title>
      <Spoiler
        showLabel={
          <Button
            variant="subtle"
            size="compact-xs"
            rightSection={<IconChevronDown />}
          >
            Show More
          </Button>
        }
        hideLabel={
          <Button
            mt="xs"
            variant="subtle"
            size="compact-xs"
            rightSection={<IconChevronUp />}
          >
            Show Less
          </Button>
        }
      >
        <SimpleGrid spacing={5} cols={2} mt="lg">
          {whatWillLearn?.map((wwl, i) => (
            <Group gap="xs" key={wwl + i}>
              <IconCheck size="20" />
              <Text size="sm">{wwl}</Text>
            </Group>
          ))}
        </SimpleGrid>
      </Spoiler>
    </Paper>
  );
}
