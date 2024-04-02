import {
  Group,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { AssignmentModel } from '~/features/assignment/assignment.model';
import { pluralizationFormat } from '~/helpers/utils';

type OnBoardProps = {
  assignment?: AssignmentModel;
};

export default function OnBoard({ assignment }: OnBoardProps) {
  return (
    <Stack>
      <Title>{assignment?.title}</Title>
      <Group gap="xs" mb="lg">
        <IconClock />
        <Text>
          {assignment?.duration}{' '}
          {pluralizationFormat(assignment?.duration || 0, 'minute', 'minutes')}{' '}
          to complete
        </Text>
      </Group>
      <TypographyStylesProvider pl="0">
        <div dangerouslySetInnerHTML={{ __html: assignment?.desc || '' }} />
      </TypographyStylesProvider>
    </Stack>
  );
}
