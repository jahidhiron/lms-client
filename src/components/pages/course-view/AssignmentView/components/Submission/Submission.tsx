import {
  Box,
  Button,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { modals } from '@mantine/modals';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import TextEditor from '~/components/core/TextEditor';
import { AssignmentModel } from '~/features/assignment/assignment.model';
import {
  AddUpdateAssignmentSubmissionModel,
  AssignmentSubmissionStatus,
} from '~/features/assignmentSubmission/assignmentSubmission.model';
import { addUpdateAssignmentSubmissionSchema } from '~/features/assignmentSubmission/assignmentSubmission.validator';
import {
  useAssignmentSubmission,
  useAssignmentSubmissionMutations,
} from '~/features/assignmentSubmission/use-assignmentSubmission';
import { ASSIGNMENT_DRAFT } from '~/helpers/constants';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';

type SubmissionProps = {
  assignment?: AssignmentModel;
};

export default function Submission({ assignment }: SubmissionProps) {
  const router = useRouter();
  const assignmentId = router.query?.itemId as string;
  const { t: commonT } = useTranslation('common');
  const {
    addNewAssignmentSubmission,
    updateAssignmentSubmission,
    submitAssignmentAnswer,
  } = useAssignmentSubmissionMutations();
  const { assignmentSubmission } = useAssignmentSubmission({
    id: assignmentId,
  });
  const form = useForm<AddUpdateAssignmentSubmissionModel>({
    validate: zodResolver(addUpdateAssignmentSubmissionSchema),
    initialValues: {
      assignmentId: '',
      status: ASSIGNMENT_DRAFT,
      answers: [],
    },
  });

  console.log(form.errors);

  const onAddNewAssignmentSubmission =
    (status: AssignmentSubmissionStatus) => () => {
      toast.promise(
        addNewAssignmentSubmission({
          ...form.values,
          status,
        }),
        {
          success: (data) => data.message,
          error: errorResolver(),
          loading: commonT('common.loading.create'),
        }
      );
    };
  const onUpdateNewAssignmentSubmission =
    (status: AssignmentSubmissionStatus) => () => {
      toast.promise(
        updateAssignmentSubmission(assignmentSubmission?._id!, {
          ...form.values,
          status,
        }),
        {
          success: (data) => data.message,
          error: errorResolver(),
          loading: commonT('common.loading.update'),
        }
      );
    };
  const onSubmit = () => {
    if (!form.validate().hasErrors) {
      modals.openConfirmModal({
        title: 'Submitting Assignment!',
        children: "Are your sure? After this you can't be able to undo",
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onConfirm() {
          toast.promise(submitAssignmentAnswer(assignmentSubmission?._id!), {
            success: (data) => data.message,
            error: errorResolver(),
            loading: commonT('common.loading.update'),
          });
        },
      });
    }
  };
  const onSubmitDraft = () => {
    if (!form.validate().hasErrors) {
      if (assignmentSubmission) {
        onUpdateNewAssignmentSubmission(ASSIGNMENT_DRAFT)();
      } else {
        onAddNewAssignmentSubmission(ASSIGNMENT_DRAFT)();
      }
    }
  };

  useEffect(() => {
    form.setFieldValue('assignmentId', assignmentId);
    if (assignmentSubmission) {
      form.setFieldValue(
        'answers',
        assignmentSubmission?.answers?.map(
          ({ title, correctAnswer, answerProvided }) => ({
            title,
            correctAnswer,
            answerProvided,
          })
        )
      );
    } else if (assignment) {
      form.setFieldValue(
        'answers',
        assignment?.questions?.map(({ title, correctAnswer }) => ({
          title,
          correctAnswer,
          answerProvided: '',
        }))
      );
    }
  }, [assignment, assignmentSubmission]);

  return (
    <Stack>
      <Title order={4}>Assignment Submission</Title>
      <Text>Save or submit your work</Text>
      <Paper p="lg" withBorder>
        <Stack w="100%">
          {form.values.answers?.map((ans, index) => (
            <Flex gap="xs" w="100%" key={index}>
              <Box>{index + 1}.</Box>
              <Box component="div">
                <TypographyStylesProvider pl="0">
                  <div dangerouslySetInnerHTML={{ __html: ans.title || '' }} />
                </TypographyStylesProvider>
                <TextEditor
                  value={ans.answerProvided}
                  onChange={(html) => {
                    if (html == '<p></p>') {
                      form.setFieldValue(`answers.${index}.answerProvided`, '');
                    } else {
                      form.setFieldValue(
                        `answers.${index}.answerProvided`,
                        html
                      );
                    }
                  }}
                  // @ts-ignore
                  error={form.errors?.[`answers.${index}.answerProvided`]}
                  withHeading
                  withList
                  withTypography
                />
              </Box>
            </Flex>
          ))}
        </Stack>
        <Group mt="lg">
          <Button onClick={onSubmitDraft} variant="outline" size="sm">
            Save as Draft
          </Button>
          <Button onClick={onSubmit} size="sm">
            Submit
          </Button>
        </Group>
      </Paper>
    </Stack>
  );
}
