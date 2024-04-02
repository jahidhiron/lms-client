import { Container, Divider, Skeleton, Stack } from '@mantine/core';
import { Fragment } from 'react';
import { useAnnouncements } from '~/features/announcement/use-announcement';
import CourseAnnouncementItem from '../CourseAnnouncementItem';

type CourseAnnouncementsProps = {};

export default function CourseAnnouncements({}: CourseAnnouncementsProps) {
  const { announcements, isLoading } = useAnnouncements({ page: 1 });

  return (
    <Container p="xl">
      <Stack gap="xl">
        {isLoading ? (
          <>
            <Skeleton h={400} />
            <Skeleton h={400} />
            <Skeleton h={400} />
          </>
        ) : (
          announcements?.map((ann, index) => (
            <Fragment key={ann._id}>
              <CourseAnnouncementItem {...ann} />
              {index <= announcements.length && <Divider />}
            </Fragment>
          ))
        )}
      </Stack>
    </Container>
  );
}
