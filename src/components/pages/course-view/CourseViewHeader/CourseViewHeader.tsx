import {
  Button,
  Divider,
  Flex,
  Group,
  Popover,
  RingProgress,
  Text,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  IconChevronDown,
  IconShare3,
  IconStarFilled,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import Logo from '~/components/core/Logo';
import AddUpdateReviewDialog from '~/components/dialogs/AddUpdateReviewDialog';
import ShareableDialog from '~/components/dialogs/ShareableDialog';
import { useEnrollment } from '~/features/enrollment/use-enrollment';
import { getUrl } from '~/helpers/utils';

type CourseViewHeaderProps = {};

export default function CourseViewHeader({}: CourseViewHeaderProps) {
  const router = useRouter();
  const eId = router.query?.eId as string;
  const { enrollment } = useEnrollment({ id: eId });
  const allLectures = useMemo(
    () => enrollment?.course?.sections?.flatMap((sec) => sec.items) || [],
    [enrollment]
  );
  const completedLectures = enrollment?.complete?.length || 0;
  const percentComplete = (completedLectures * 100) / (allLectures.length || 0);
  const openReviewDialog = () => {
    modals.open({
      title: 'Write a review!!',
      children: <AddUpdateReviewDialog courseId={enrollment?.course?._id!} />,
    });
  };
  const openShareDialog = () => {
    modals.open({
      title: 'What to share this course?',
      children: <ShareableDialog url={getUrl(`courses/${eId}`)} />,
    });
  };

  return (
    <Flex h="100%" px="md" align="center" justify="space-between">
      <Group>
        <Logo mode="white" />
        <Divider orientation="vertical" />
        <Text c="white">{enrollment?.course?.title}</Text>
      </Group>
      <Group>
        <Button
          leftSection={<IconStarFilled size="20" />}
          onClick={openReviewDialog}
          size="xs"
          variant="transparent"
          c="white"
        >
          Leave Rating
        </Button>
        <Popover shadow="md" withArrow arrowSize={20}>
          <Popover.Target>
            <Button
              leftSection={
                <RingProgress
                  size={30}
                  thickness={3}
                  roundCaps
                  sections={[
                    { value: percentComplete, color: 'orange', stroke: '.5' },
                  ]}
                />
              }
              size="xs"
              variant="transparent"
              c="white"
              rightSection={<IconChevronDown />}
            >
              Your Progress
            </Button>
          </Popover.Target>
          <Popover.Dropdown miw={300}>
            <Text size="sm" fw="bold">
              {completedLectures} of {allLectures?.length || 0} complete.
            </Text>
          </Popover.Dropdown>
        </Popover>
        <Button
          leftSection={<IconShare3 />}
          onClick={openShareDialog}
          size="xs"
          variant="transparent"
          style={{ borderColor: 'white' }}
          c="white"
        >
          Share
        </Button>
      </Group>
    </Flex>
  );
}
