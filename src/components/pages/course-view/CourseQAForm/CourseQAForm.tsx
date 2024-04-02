import {
  Anchor,
  Avatar,
  Button,
  Card,
  Group,
  List,
  Radio,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { Dispatch, SetStateAction, useState } from 'react';
import TextEditor from '~/components/core/TextEditor';
import toast from 'react-hot-toast';
import { useQAMutations } from '~/features/qa/useQa';
import { errorResolver } from '~/helpers/utils';
import useTranslation from 'next-translate/useTranslation';
import { CourseQAView } from '~/features/qa/qa.model';
import { useRouter } from 'next/router';
import { useCourse } from '~/features/course/use-course';

type CourseQAFormProps = {
  setViewState: Dispatch<SetStateAction<CourseQAView>>;
};

export default function CourseQAForm({ setViewState }: CourseQAFormProps) {
  const router = useRouter();
  const [qaType, setQaType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [addQA, setAddQA] = useState(false);
  const { addNewQA } = useQAMutations();
  const { t: commonT } = useTranslation('common');

  const courseSlug = router.query?.slug as string;
  const lectureId = router.query?.itemId as string;

  const { course } = useCourse({ id: courseSlug, isPublic: true });

  return (
    <Stack>
      {!addQA ? (
        <Stack>
          <Group>
            <Text size="xl">My question relates to</Text>
          </Group>
          <Group>
            <Radio.Group name="qaType" onChange={(event) => setQaType(event)}>
              <Radio
                label="Course Content"
                description="This might include comments, questions, tips, or projects to share"
                value="course"
              />
              <Radio
                label="Something else"
                description="This might include questions about certificates, audio and video troubleshooting, or download issues"
                value="app"
              />
            </Radio.Group>
          </Group>
          <Group>
            <Button disabled={!qaType} onClick={() => setAddQA(true)}>
              Continue
            </Button>
          </Group>
        </Stack>
      ) : null}

      {qaType === 'course' && addQA && (
        <Stack>
          <Card>
            <Title order={5}>
              Tips on getting your questions answered faster
            </Title>
            <List>
              <List.Item>
                Search to see if your question has been asked before
              </List.Item>
              <List.Item>
                Be detailed; provide screenshots, error messages, code, or other
                clues whenever possible
              </List.Item>
              <List.Item>Check grammar and spelling</List.Item>
            </List>
          </Card>
          <Card>
            <Group>
              <Avatar>RB</Avatar>
              <Stack>
                <Group>
                  <Anchor>Robert Bunch</Anchor>-<Text>instructor</Text>
                </Group>
                <Text>
                  Given our current workload, we are able to respond within 24
                  hours.
                </Text>
              </Stack>
            </Group>
          </Card>
          <Group>
            <Title order={6}>Title or summary</Title>
            <TextInput
              placeholder="e.g. Why do we use fit_transform() for training_set?"
              style={{ width: '100%' }}
              value={title}
              onChange={(event) => setTitle(event.currentTarget.value)}
            />
          </Group>

          <Group>
            <Title order={6}>Details (optional)</Title>
            <TextEditor
              onChange={(value) => setDesc(value)}
              value={desc}
              withHeading
              withLink
              withTypography
            />
            <Button
              onClick={() =>
                toast.promise(
                  addNewQA({
                    title,
                    desc,
                    courseId: course?._id!,
                    lectureId,
                  }),
                  {
                    success: (data) => {
                      // router.replace(
                      //   `/console/teacher/course/${data.data.course._id}/manage/goals`
                      // );
                      setViewState('list');
                      return data.message;
                    },
                    error: errorResolver(),
                    loading: commonT('common.loading.create', {
                      feature: commonT('common.words.course'),
                    }),
                  }
                )
              }
            >
              Publish
            </Button>
          </Group>
        </Stack>
      )}
    </Stack>
  );
}
