import { Container, Stack, Tabs, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import EnrollmentList from '~/components/pages/my-courses/EnrollmentList';
import Wishlisting from '~/components/pages/my-courses/Wishlisting';
import useTranslation from '~/hooks/use-translation';

const MyCoursesPage = () => {
  const router = useRouter();
  const tabId = router.query?.tabId as string;
  const { t: commonT } = useTranslation('common');
  return (
    <Container size="lg">
      <Stack>
        <Title py="xl">My Learning</Title>
        <Tabs
          value={tabId}
          onChange={(value) => {
            router.replace({
              pathname: router.pathname,
              query: { ...router.query, tabId: value },
            });
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="learning">
              {commonT('common.labels.my-learning')}
            </Tabs.Tab>
            <Tabs.Tab value="wishlist">
              {commonT('common.labels.wishlist')}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="learning">
            <EnrollmentList />
          </Tabs.Panel>
          <Tabs.Panel value="wishlist">
            <Wishlisting />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};

export default MyCoursesPage;
