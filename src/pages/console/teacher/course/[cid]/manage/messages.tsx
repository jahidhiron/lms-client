import { Box, Button, Stack, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import TextEditor from '~/components/core/TextEditor';
import CourseEditPageHeader from '~/components/headers/CourseEditPageHeader';
import { useCourseMutations } from '~/features/course/use-course';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import { useCourseFormContext } from '~/libs/providers/CourseFormProvider';

const MessagesPage = () => {
  const router = useRouter();
  const courseId = router?.query?.cid as string;
  const form = useCourseFormContext();
  const [congratulationsMsg, setCongratulationMsg] = useState<string>('');
  const [welcomeMsg, setWelcomeMsg] = useState<string>('');
  const { t: commonT } = useTranslation('common');

  const { updateCourse } = useCourseMutations();
  useEffect(() => {
    if (congratulationsMsg !== form.values.congratulationsMsg) {
      setCongratulationMsg(form.values.congratulationsMsg);
    }
    if (welcomeMsg !== form.values.welcomeMsg) {
      setWelcomeMsg(form.values.welcomeMsg);
    }
  }, [form.values.price]);

  return (
    <Box px="xl">
      <CourseEditPageHeader title="Course messages" />

      <Box mt="xs">
        <Text>
          Write messages to your students (optional) that will be sent
          automatically when they join or complete your course to encourage
          students to engage with course content. If you do not wish to send a
          welcome or congratulations message, leave the text box blank.
        </Text>

        <Stack my="md">
          <TextEditor
            value={welcomeMsg}
            label="Welcome Message"
            labelProps={{ fw: 'bold' }}
            onChange={(value) => {
              setWelcomeMsg(value);
            }}
            withHeading
            withList
            withTypography
          />

          <TextEditor
            labelProps={{ fw: 'bold' }}
            label="Congratulations Message"
            value={congratulationsMsg}
            onChange={(value) => {
              setCongratulationMsg(value);
            }}
            withHeading
            withList
            withTypography
          />
        </Stack>
        <Button
          size="xs"
          disabled={
            form.values.congratulationsMsg === congratulationsMsg &&
            form.values.welcomeMsg === welcomeMsg
          }
          //   @ts-ignore
          onClick={() => {
            toast.promise(
              updateCourse(courseId, {
                ...form.values,
                welcomeMsg,
                congratulationsMsg,
              }),
              {
                success: (data) => {
                  form.setFieldValue('welcomeMsg', welcomeMsg);
                  form.setFieldValue('congratulationsMsg', congratulationsMsg);
                  return data.message;
                },
                error: errorResolver(),
                loading: commonT('common.loading.update', {
                  feature: commonT('common.words.course'),
                }),
              }
            );
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default MessagesPage;
