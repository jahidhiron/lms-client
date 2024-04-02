import {
  ActionIcon,
  Button,
  Container,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Stepper,
  Text,
} from '@mantine/core';
import { useFullscreen } from '@mantine/hooks';
import { IconMaximize, IconMinimize } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useAssignment } from '~/features/assignment/use-assignment';
import { useAssignmentSubmission } from '~/features/assignmentSubmission/use-assignmentSubmission';
import { ASSIGNMENT_DRAFT, ASSIGNMENT_SUBMITTED } from '~/helpers/constants';
import useCurrentNextSectionItem from '~/hooks/use-current-sectionItem';
import Instructions from './components/Instructions';
import InstructorExample from './components/InstructorExample';
import OnBoard from './components/OnBoard';
import Submission from './components/Submission';

type AssignmentViewProps = {};

type ViewStateType = 'onBoard' | 'assignment';
type ActiveStepType = 0 | 1 | 2 | 3;

export default function AssignmentView({}: AssignmentViewProps) {
  const router = useRouter();
  const eId = router.query?.eId as string;
  const [viewState, setViewState] = useState<ViewStateType>('onBoard');
  const [activeStep, setActiveStep] = useState<ActiveStepType>(0);
  const assignmentId = router?.query?.itemId as string;
  const { nextItem, moveToNextItem, isNextItemAvailable } =
    useCurrentNextSectionItem({
      eId,
      itemId: assignmentId,
    });
  const { assignment } = useAssignment({ id: assignmentId });
  const { assignmentSubmission } = useAssignmentSubmission({
    id: assignmentId,
  });

  const { ref, fullscreen, toggle } = useFullscreen();

  const onMoveNextStep = () => {
    setActiveStep((prev) => ++prev as ActiveStepType);
  };
  const onMovePreviousStep = () => {
    setActiveStep((prev) => --prev as ActiveStepType);
  };

  const renderView = useMemo(() => {
    switch (viewState) {
      case 'assignment':
        return (
          <Stepper
            active={activeStep}
            onStepClick={(index) => setActiveStep(index as ActiveStepType)}
            styles={{
              steps: {
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
                zIndex: 80,
                padding: '10px 20px',
              },
            }}
          >
            <Stepper.Step label="Instructions">
              <Instructions assignment={assignment} />
            </Stepper.Step>
            <Stepper.Step label="Submission">
              <Submission assignment={assignment} />
            </Stepper.Step>
            <Stepper.Step label="InstructorExample">
              <InstructorExample
                onAlertClick={onMovePreviousStep}
                assignment={assignment}
              />
            </Stepper.Step>
            {/* <Stepper.Step label="Feedback">
              <GiveFeedback />
            </Stepper.Step> */}
          </Stepper>
        );

      default:
        return <OnBoard assignment={assignment} />;
    }
  }, [assignment, viewState, activeStep]);

  const renderButton = useMemo(() => {
    switch (viewState) {
      case 'assignment': {
        switch (activeStep) {
          case 0:
            return (
              <>
                <Button size="xs" onClick={onMoveNextStep}>
                  Next Step
                </Button>
              </>
            );
          case 1:
            return (
              <Group>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={onMovePreviousStep}
                >
                  Previous Step
                </Button>
                <Button size="xs" onClick={onMoveNextStep}>
                  Next Step
                </Button>
              </Group>
            );
          default:
            return (
              <>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={onMovePreviousStep}
                >
                  Previous Step
                </Button>
              </>
            );
        }
      }

      default:
        return (
          <>
            {assignmentSubmission?.status === ASSIGNMENT_SUBMITTED ? (
              <>
                {isNextItemAvailable ? (
                  <Button size="xs" onClick={moveToNextItem}>
                    {nextItem?.assignmentId
                      ? 'Next Assignment'
                      : nextItem?.lectureId
                      ? 'Next Lecture'
                      : nextItem?.quizId
                      ? 'Next Quiz'
                      : 'Next Lecture'}
                  </Button>
                ) : null}
              </>
            ) : (
              <>
                <Button size="xs" variant="outline">
                  Skip Assignment
                </Button>
                <Button size="xs" onClick={() => setViewState('assignment')}>
                  Start Assignment
                </Button>
              </>
            )}
          </>
        );
    }
  }, [viewState, assignment, activeStep]);

  useEffect(() => {
    if (
      assignmentSubmission?.status === ASSIGNMENT_DRAFT &&
      viewState !== 'assignment'
    ) {
      setViewState('assignment');
      setActiveStep(1);
    }

    if (assignmentSubmission?.status === ASSIGNMENT_SUBMITTED) {
      setViewState('onBoard');
      setActiveStep(0);
    }
  }, [assignmentSubmission]);

  return (
    <Stack ref={ref} bg="white" p="xs" pos="relative" h="500">
      <ScrollArea w="100%">
        <Container mt="xl" h={!fullscreen ? 390 : '87vh'} w="100%">
          {renderView}
        </Container>
      </ScrollArea>

      <Paper p="5" w="100%" bottom="0" withBorder>
        <Group justify="space-between">
          <Text></Text>
          <Group>
            {renderButton}
            <ActionIcon onClick={toggle} color="dark" variant="transparent">
              {fullscreen ? <IconMinimize /> : <IconMaximize />}
            </ActionIcon>
          </Group>
        </Group>
      </Paper>
    </Stack>
  );
}
