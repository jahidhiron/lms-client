import { Box, Divider, Paper, Tabs, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconDice4 } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AssignmentModel } from '~/features/assignment/assignment.model';
import {
  useAssignment,
  useAssignmentMutations,
} from '~/features/assignment/use-assignment';
import { autoUpdateTrigger, errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import { useCourseFormContext } from '~/libs/providers/CourseFormProvider';
import SectionItemPreview from '../../SectionItemPreview';
import AssignmentBasicInfoForm from '../AssignmentBasicInfoForm';
import AssignmentInfoForm from '../AssignmentInfoForm';
import AssignmentInstructionForm from '../AssignmentInstructionForm';
import AssignmentQuestionsListing from '../AssignmentQuestionsListing';
import AssignmentSolutionForm from '../AssignmentSolutionForm';
import classes from './AssignmentContainer.module.css';

type AssignmentContainerProps = {
  sectionIndex: number;
  assignmentIndex: number;
  assignmentId?: string;
  assignment?: AssignmentModel;
};

export type AssignmentViews = 'description' | 'resources' | 'content';

export default function AssignmentContainer({
  sectionIndex,
  assignmentIndex,
  assignmentId,
}: AssignmentContainerProps) {
  const router = useRouter();
  const courseId = router.query?.cid as string;
  const { t: commonT } = useTranslation('common');
  const [preview, setPreview] = useState(!!assignmentId);
  const [collapsed, setCollapsed] = useState(false);
  const { addNewAssignment, partialUpdateAssignment } =
    useAssignmentMutations();
  const { assignment } = useAssignment({ id: assignmentId! });
  const form = useCourseFormContext();

  return (
    <Paper withBorder bg="white" w="100%" p="md" className={classes.container}>
      {preview ? (
        <SectionItemPreview
          toggleLabel="Contents"
          sectionName="Assignment"
          collapsedState={collapsed}
          onToggleCollapsed={() => setCollapsed(!collapsed)}
          icon={<IconDice4 size="20" />}
          itemIndex={assignmentIndex}
          onEdit={() => {
            setCollapsed(false);
            setPreview(false);
          }}
          onRemove={() => {
            modals.openConfirmModal({
              title: commonT('common.labels.remove', {
                feature: commonT('common.words.assignment'),
                title: assignment?.title,
              }),
              centered: true,
              children: (
                <Text size="sm">
                  {commonT('common.labels.remove-message', {
                    feature: commonT('common.words.assignment'),
                    title: assignment?.title,
                  })}
                </Text>
              ),
              labels: {
                confirm: commonT('common.words.confirm'),
                cancel: commonT('common.words.cancel'),
              },
              confirmProps: { color: 'red' },
              onConfirm: () => {
                form.setFieldValue(
                  `sections.${sectionIndex}.items`,
                  form.values.sections
                    ?.at(sectionIndex)
                    ?.items?.filter((_, i) => assignmentIndex != i)
                );

                autoUpdateTrigger(form);

                // TODO: call a assignment cleanup api endpoint to remove all nested resources from the backend.
              },
            });
          }}
          title={assignment?.title || ''}
        />
      ) : (
        <AssignmentInfoForm
          title={assignment?.title || ''}
          onSave={(title) => {
            if (assignmentId || assignment) {
              toast.promise(
                partialUpdateAssignment(
                  (assignmentId || assignment?._id)!,
                  {
                    title,
                  },
                  assignment
                ),
                {
                  success: (data) => {
                    setPreview(true);
                    return data.message;
                  },
                  error: errorResolver(form),
                  loading: commonT('common.loading.create', {
                    feature: commonT('common.words.assignment'),
                  }),
                }
              );
              return;
            }
            toast.promise(addNewAssignment({ title, courseId }), {
              success: (data) => {
                form.setFieldValue(
                  `sections.${sectionIndex}.items.${assignmentIndex}.assignmentId`,
                  data.data?.assignment?._id
                );
                setPreview(true);

                autoUpdateTrigger(form);
                return data.message;
              },
              error: errorResolver(form),
              loading: commonT('common.loading.create', {
                feature: commonT('common.words.assignment'),
              }),
            });
          }}
          onCancel={() => {
            if (!assignmentId) {
              form.setFieldValue(
                `sections.${sectionIndex}.items`,
                form.values?.sections
                  ?.at(sectionIndex)
                  ?.items?.filter((_, index) => index != assignmentIndex)
              );
            }
            setPreview(true);
          }}
          assignmentIndex={assignmentIndex}
        />
      )}
      <Box mt="xs" hidden={!collapsed}>
        <Divider />
        <Box py="md">
          <Tabs orientation="vertical" defaultValue="basic" variant="pills">
            <Tabs.List>
              <Tabs.Tab value="basic">Basic Info</Tabs.Tab>
              <Tabs.Tab value="instruction">Instruction</Tabs.Tab>
              <Tabs.Tab value="questions">Questions</Tabs.Tab>
            </Tabs.List>
            <Paper p="sm" w="100%" withBorder mx="xs">
              <Tabs.Panel value="basic">
                <AssignmentBasicInfoForm
                  desc={assignment?.desc || ''}
                  title={assignment?.title || ''}
                  duration={assignment?.duration || 0}
                  onSave={(title, desc, duration) => {
                    toast.promise(
                      partialUpdateAssignment(
                        (assignmentId || assignment?._id)!,
                        {
                          title,
                          desc,
                          duration,
                        },
                        assignment
                      ),
                      {
                        success: (data) => {
                          setPreview(true);
                          return data.message;
                        },
                        error: errorResolver(form),
                        loading: commonT('common.loading.update', {
                          feature: commonT('common.words.assignment'),
                        }),
                      }
                    );
                  }}
                />
              </Tabs.Panel>
              <Tabs.Panel value="instruction">
                <AssignmentInstructionForm
                  instructionDesc={assignment?.instructionDesc || ''}
                  instructionFileId={assignment?.instructionFileId}
                  instructionVideoId={assignment?.instructionVideoId}
                  instructionVideo={assignment?.instructionVideo}
                  instructionFile={assignment?.instructionFile}
                  onSave={(
                    instructionDesc,
                    instructionFileId,
                    instructionVideoId
                  ) => {
                    toast.promise(
                      partialUpdateAssignment(
                        (assignmentId || assignment?._id)!,
                        {
                          instructionVideoId,
                          instructionFileId,
                          instructionDesc,
                        },
                        assignment
                      ),
                      {
                        success: (data) => {
                          setPreview(true);
                          return data.message;
                        },
                        error: errorResolver(form),
                        loading: commonT('common.loading.update', {
                          feature: commonT('common.words.assignment'),
                        }),
                      }
                    );
                  }}
                />
              </Tabs.Panel>
              <Tabs.Panel value="questions">
                <AssignmentQuestionsListing
                  questions={assignment?.questions}
                  onAdd={(question) => {
                    toast.promise(
                      partialUpdateAssignment(
                        (assignmentId || assignment?._id)!,
                        {
                          questions: [
                            ...(assignment?.questions || []),
                            question,
                          ],
                        },
                        assignment
                      ),
                      {
                        success: (data) => {
                          setPreview(true);
                          modals.closeAll();
                          return data.message;
                        },
                        error: errorResolver(form),
                        loading: commonT('common.loading.update', {
                          feature: commonT('common.words.assignment'),
                        }),
                      }
                    );
                  }}
                  onRemove={(_ques, questionIndex) => {
                    toast.promise(
                      partialUpdateAssignment(
                        (assignmentId || assignment?._id)!,
                        {
                          questions:
                            assignment?.questions?.filter(
                              (_, index) => index !== questionIndex
                            ) || [],
                        },
                        assignment
                      ),
                      {
                        success: (data) => {
                          setPreview(true);
                          modals.closeAll();
                          return data.message;
                        },
                        error: errorResolver(form),
                        loading: commonT('common.loading.update', {
                          feature: commonT('common.words.assignment'),
                        }),
                      }
                    );
                  }}
                  onEdit={(question, questionIndex) => {
                    const questions = assignment?.questions || [];
                    questions[questionIndex] = question;

                    toast.promise(
                      partialUpdateAssignment(
                        (assignmentId || assignment?._id)!,
                        {
                          questions,
                        },
                        assignment
                      ),
                      {
                        success: (data) => {
                          setPreview(true);
                          modals.closeAll();
                          return data.message;
                        },
                        error: errorResolver(form),
                        loading: commonT('common.loading.update', {
                          feature: commonT('common.words.assignment'),
                        }),
                      }
                    );
                  }}
                />
              </Tabs.Panel>

              <Tabs.Panel value="questions">
                <AssignmentSolutionForm
                  solutionFileId={assignment?.solutionFileId}
                  solutionVideoId={assignment?.solutionVideoId}
                  solutionVideo={assignment?.solutionVideo}
                  solutionFile={assignment?.solutionFile}
                  onSave={(solutionFileId, solutionVideoId) => {
                    toast.promise(
                      partialUpdateAssignment(
                        (assignmentId || assignment?._id)!,
                        {
                          solutionFileId,
                          solutionVideoId,
                        },
                        assignment
                      ),
                      {
                        success: (data) => {
                          setPreview(true);
                          return data.message;
                        },
                        error: errorResolver(form),
                        loading: commonT('common.loading.update', {
                          feature: commonT('common.words.assignment'),
                        }),
                      }
                    );
                  }}
                />
              </Tabs.Panel>
            </Paper>
          </Tabs>
        </Box>
      </Box>
    </Paper>
  );
}
