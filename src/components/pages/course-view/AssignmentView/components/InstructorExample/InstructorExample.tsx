import {
  Alert,
  AspectRatio,
  Box,
  Button,
  List,
  Paper,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import { IconBrandOpenSource, IconInfoCircle } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import VideoPlayer from '~/components/core/VideoPlayer';
import { AssignmentModel } from '~/features/assignment/assignment.model';
import { useAssignmentSubmission } from '~/features/assignmentSubmission/use-assignmentSubmission';
import { getStaticContentUrl } from '~/helpers/utils';

type InstructorExampleProps = {
  onAlertClick?: () => void;
  assignment?: AssignmentModel;
};

export default function InstructorExample({
  onAlertClick,
  assignment,
}: InstructorExampleProps) {
  const router = useRouter();
  const assignmentId = router.query?.itemId as string;
  const { assignmentSubmission } = useAssignmentSubmission({
    id: assignmentId,
  });
  return (
    <Stack>
      <Title order={4}>How do your do?</Title>
      <Text>Compare the instructor&apos;s example to your own</Text>
      <Paper p="lg" withBorder>
        <Stack>
          <Title order={6}>Instructor Example</Title>
          {/* <Group> <Box> <Avatar /> </Box> <Box> <Text mb="sm">Omar Faruk</Text> </Box> </Group> */}
          <List type="ordered">
            {assignment?.questions?.map((ques) => (
              <List.Item key={ques.title}>
                <TypographyStylesProvider pl="0">
                  <Box
                    mb="0"
                    dangerouslySetInnerHTML={{ __html: ques?.title || '' }}
                  />
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: ques?.correctAnswer || '',
                    }}
                  />
                </TypographyStylesProvider>
              </List.Item>
            ))}
          </List>
          {assignment?.solutionVideoId && (
            <AspectRatio ratio={16 / 7}>
              <Box>
                <VideoPlayer
                  captions={[]}
                  videoSource={getStaticContentUrl(
                    assignment?.solutionVideo?.path || ''
                  )}
                />
              </Box>
            </AspectRatio>
          )}
          {assignment?.solutionFileId && (
            <Box>
              <Title order={6}>Download Resource File</Title>
              <Button
                mt="sm"
                variant="transparent"
                component={Link}
                target="_blank"
                href={
                  getStaticContentUrl(assignment?.solutionFile?.path || '') ||
                  '#'
                }
                size="compact-xs"
                leftSection={<IconBrandOpenSource size="15" />}
              >
                {assignment?.solutionFile?.name}
              </Button>
            </Box>
          )}
        </Stack>
      </Paper>
      <Paper p="lg" withBorder>
        <Stack>
          <Title order={6}>Your submission</Title>
          <List type="ordered">
            {assignmentSubmission?.answers?.map((ans) => (
              <List.Item key={ans.title}>
                <TypographyStylesProvider pl="0">
                  <Box
                    mb="0"
                    dangerouslySetInnerHTML={{ __html: ans?.title || '' }}
                  />
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: ans?.answerProvided || '',
                    }}
                  />
                </TypographyStylesProvider>
              </List.Item>
            ))}
          </List>
        </Stack>

        {!assignmentSubmission && (
          <Alert
            mt="lg"
            icon={<IconInfoCircle />}
            title="You haven't answered the assignment yet."
          >
            <Box>
              <Text>
                Submit your work to get constructive feedback from your
                instructors and peers.
              </Text>
              <Button onClick={onAlertClick} size="xs" mt="lg">
                Add your Answer
              </Button>
            </Box>
          </Alert>
        )}
      </Paper>
    </Stack>
  );
}
