import {
  AspectRatio,
  Box,
  Button,
  Group,
  List,
  Paper,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import { IconBrandOpenSource, IconClock } from '@tabler/icons-react';
import Link from 'next/link';
import VideoPlayer from '~/components/core/VideoPlayer';
import { AssignmentModel } from '~/features/assignment/assignment.model';
import { getStaticContentUrl, pluralizationFormat } from '~/helpers/utils';

type InstructionsProps = {
  assignment?: AssignmentModel;
};

export default function Instructions({ assignment }: InstructionsProps) {
  return (
    <Stack gap="xs" mt="lg">
      <Title order={2}>Assignment instructions</Title>
      <Group gap="xs">
        <IconClock />
        <Text>
          {assignment?.duration}{' '}
          {pluralizationFormat(assignment?.duration || 0, 'minute', 'minutes')}{' '}
          to complete
        </Text>
      </Group>
      <Paper p="lg" shadow="lg" withBorder>
        <Stack>
          <AspectRatio ratio={16 / 7}>
            <Box>
              <VideoPlayer
                captions={[]}
                videoSource="https://player.vimeo.com/external/284652268.sd.mp4?s=0bf23f0d69280b20e39fb2dd5501a5b0d4612a77&profile_id=164&oauth2_token_id=57447761"
              />
            </Box>
          </AspectRatio>
          <TypographyStylesProvider pl="0">
            <div dangerouslySetInnerHTML={{ __html: assignment?.desc || '' }} />
          </TypographyStylesProvider>
          <Box>
            <Title order={6}>Questions for this assignment</Title>
            <List type="ordered" mt="sm">
              {assignment?.questions?.map((ques, index) => (
                <List.Item key={ques.title + index}>
                  <div
                    dangerouslySetInnerHTML={{ __html: ques?.title || '' }}
                  />
                </List.Item>
              ))}
            </List>
          </Box>
          <Box>
            <Title order={6}>Download Resource File</Title>
            <Button
              mt="sm"
              variant="transparent"
              component={Link}
              target="_blank"
              href={
                getStaticContentUrl(assignment?.instructionFile?.path || '') ||
                '#'
              }
              size="compact-xs"
              leftSection={<IconBrandOpenSource size="15" />}
            >
              {assignment?.instructionFile?.name}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
