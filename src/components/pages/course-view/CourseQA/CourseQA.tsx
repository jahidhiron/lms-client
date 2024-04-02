import {
  Button,
  Center,
  Group,
  Select,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { useDebouncedState, useScrollIntoView } from '@mantine/hooks';
import { IconArrowLeft, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import TextInput from '~/components/core/TextInput';
import EmptyListContent from '~/components/utils/EmptyListContent';
import { CourseQAView } from '~/features/qa/qa.model';
import { useQAs } from '~/features/qa/useQa';
import CourseQADetail from '../CourseQADetail';
import CourseQAForm from '../CourseQAForm';
import CourseQAList from '../CourseQAList';

type CourseQAProps = {};

type QaFilterType = 'all' | 'id';

export default function QA({}: CourseQAProps) {
  const router = useRouter();
  const page = parseInt(router.query?.page as string) || 1;
  const itemType = router.query?.itemType as string;
  const itemId = router.query?.itemId as string;
  const [viewState, setViewState] = useState<CourseQAView>('list');
  const [qaId, setQaId] = useState<string | undefined>();
  const [qaFilter, setQAFilter] = useState<QaFilterType>('all');
  const [qaSearchText, setQASearchText] = useDebouncedState('', 200);
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 500,
  });
  const { qas, total_qas, isLoading } = useQAs({
    page,
    lectureId: qaFilter == 'id' && itemType === 'lecture' ? itemId : undefined,
    q: qaSearchText,
  });

  useEffect(() => {
    if (targetRef?.current) {
      scrollIntoView();
    }
  }, [viewState]);

  const courseQaView = useMemo(() => {
    switch (viewState) {
      case 'list':
        return (
          <>
            <Text fw="bolder" size="xl">
              All questions in this course ({total_qas})
            </Text>
            <CourseQAList
              qas={qas}
              setViewState={setViewState}
              setQaId={setQaId}
            />
          </>
        );
      case 'detail':
        return (
          <Stack w="100%" align="flex-start" ref={targetRef}>
            <Button
              variant="outline"
              onClick={() => {
                setViewState('list');
                setQaId(undefined);
              }}
              size="xs"
              leftSection={<IconArrowLeft />}
            >
              Back to All Questions
            </Button>
            <CourseQADetail qaId={qaId} setViewState={setViewState} />
          </Stack>
        );
      case 'new':
        return (
          <Stack ref={targetRef} align="flex-start" w="100%">
            <Button
              onClick={() => {
                setViewState('list');
                setQaId(undefined);
              }}
              variant="outline"
              size="xs"
              leftSection={<IconArrowLeft />}
            >
              Back to All Questions
            </Button>
            <CourseQAForm setViewState={setViewState} />
          </Stack>
        );
      default:
        return null;
    }
  }, [viewState, qas]);

  const courseListQAHeader = useMemo(() => {
    switch (viewState) {
      case 'list':
        return (
          <>
            <TextInput
              placeholder="Search all course question"
              mt="md"
              w="100%"
              type="search"
              rightSection={
                <IconSearch size="20" aria-label="Search all course question" />
              }
              defaultValue={qaSearchText}
              onChange={(ev) => setQASearchText(ev.target.value)}
            />
            <Group>
              <Select
                defaultValue="all"
                data={[
                  { value: 'all', label: 'All Lectures' },
                  {
                    value: 'id',
                    label: 'Current Lecture',
                    disabled: itemType !== 'lecture',
                  },
                ]}
                onChange={(value) => {
                  setQAFilter(value as QaFilterType);
                }}
              />
            </Group>
          </>
        );
      default:
        return null;
    }
  }, [viewState, qas, itemType]);

  const courseListQAFooter = useMemo(() => {
    switch (viewState) {
      case 'list':
        return (
          <Button
            variant="outline"
            onClick={() => {
              setViewState('new');
            }}
          >
            Ask a new question
          </Button>
        );
      default:
        return null;
    }
  }, [viewState, qas]);

  return (
    <Center>
      <Stack align="flex-start" w="80%" p="xl">
        {courseListQAHeader}
        {isLoading ? (
          <Stack w={'100%'}>
            <Skeleton h={200} />
            <Skeleton h={200} />
            <Skeleton h={200} />
            <Skeleton h={200} />
            <Skeleton h={200} />
          </Stack>
        ) : total_qas == 0 ? (
          <Center w="100%" p="md">
            <EmptyListContent message="No Q&A Found" />
          </Center>
        ) : (
          <Stack gap="sm" w="100%">
            {courseQaView}
          </Stack>
        )}
        {courseListQAFooter}
      </Stack>
    </Center>
  );
}
