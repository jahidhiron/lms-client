import { Tabs, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import { EnrollmentModel } from '~/features/enrollment/enrollment.model';
import { LectureNoteView } from '~/pages/course/[slug]/[eId]/[itemType]/[itemId]/[tabId]';
import CourseAnnouncements from '../CourseAnnouncements';
import CourseLectureNotes from '../CourseLectureNotes';
import CourseOverview from '../CourseOverview';
import CourseReviews from '../CourseReviews';
import CourseQA from '../CourseQA';

type CourseViewContentProps = {
  enrollment?: EnrollmentModel;
  noteViewState: LectureNoteView;
  setNoteViewState: Dispatch<SetStateAction<LectureNoteView>>;
};

export default function CourseViewContent({
  enrollment,
  noteViewState,
  setNoteViewState,
}: CourseViewContentProps) {
  const router = useRouter();
  const tabId = (router.query?.tabId as string) || 'overview';

  const onTabChange = (tabId: string | null) => {
    if (tabId && !router.asPath.endsWith(tabId)) {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            tabId,
          },
        },
        undefined,
        { scroll: false }
      );
    }
  };
  return (
    <Tabs value={tabId} onChange={onTabChange}>
      <Tabs.List>
        <Tabs.Tab value="none" disabled></Tabs.Tab>
        <Tabs.Tab value="overview">
          <Title order={6} c={tabId == 'overview' ? 'black' : 'dimmed'}>
            Overview
          </Title>
        </Tabs.Tab>
        <Tabs.Tab value="qa">
          <Title order={6} c={tabId == 'qa' ? 'black' : 'dimmed'}>
            Q&A
          </Title>
        </Tabs.Tab>
        <Tabs.Tab value="notes">
          <Title order={6} c={tabId == 'notes' ? 'black' : 'dimmed'}>
            Notes
          </Title>
        </Tabs.Tab>
        <Tabs.Tab value="announcement">
          <Title order={6} c={tabId == 'announcement' ? 'black' : 'dimmed'}>
            Announcement
          </Title>
        </Tabs.Tab>
        <Tabs.Tab value="reviews">
          <Title order={6} c={tabId == 'reviews' ? 'black' : 'dimmed'}>
            Reviews
          </Title>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">
        <CourseOverview course={enrollment?.course} />
      </Tabs.Panel>
      <Tabs.Panel value="qa">
        <CourseQA />
      </Tabs.Panel>
      <Tabs.Panel value="notes">
        <CourseLectureNotes
          viewState={noteViewState}
          setViewState={setNoteViewState}
        />
      </Tabs.Panel>
      <Tabs.Panel value="announcement">
        <CourseAnnouncements />
      </Tabs.Panel>
      <Tabs.Panel value="reviews">
        <CourseReviews enrollment={enrollment} />
      </Tabs.Panel>
    </Tabs>
  );
}
