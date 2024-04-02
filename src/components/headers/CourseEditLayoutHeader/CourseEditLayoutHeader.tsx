import { Badge, Button, Flex, Group, Paper, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { useRef } from 'react';
import useTranslation from '~/hooks/use-translation';
import { useCourseFormContext } from '~/libs/providers/CourseFormProvider';
import classes from './CourseEditLayoutHeader.module.css';

type CourseEditLayoutHeaderProps = {
  title?: string;
  status?: string;
};

export default function CourseEditLayoutHeader({
  title,
}: CourseEditLayoutHeaderProps) {
  const { t: commonT } = useTranslation('common');
  const form = useCourseFormContext();
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  // @ts-ignore
  form.submitBtnRef = submitBtnRef.current;

  return (
    <Paper p="xs" pos="sticky" top={0} withBorder className={classes.header}>
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <Button
            component={Link}
            href="/console/teacher/courses"
            leftSection={<IconArrowLeft />}
            variant="transparent"
          >
            {commonT('common.messages.back-to-courses')}
          </Button>
          <Group align="center">
            <Title order={4}>{title}</Title>
            <Badge variant="light" color="gray">
              Draft
            </Badge>
          </Group>
        </Flex>
        <Group>
          <Button variant="light" type="submit" ref={submitBtnRef}>
            {commonT('common.words.save')}
          </Button>
        </Group>
      </Flex>
    </Paper>
  );
}
