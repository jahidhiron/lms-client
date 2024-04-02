import {
  ActionIcon,
  Button,
  Center,
  Flex,
  Pagination,
  SimpleGrid,
  Skeleton,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconSearch } from '@tabler/icons-react';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';
import { ChangeEvent } from 'react';
import TeacherCourseCard from '~/components/cards/TeacherCourseCard';
import TextInput from '~/components/core/TextInput';
import CourseCreationDialog from '~/components/dialogs/CourseCreationDialog';
import PanelHeader from '~/components/headers/PanelHeader';
import { useCourses } from '~/features/course/use-course';
import useTranslation from '~/hooks/use-translation';

const CoursesPage = () => {
  const { t: commonT } = useTranslation('common');
  const router = useRouter();
  const q = router?.query?.q as string;
  const page = parseInt(router.query?.page as string) || 1;

  const { courses, isLoading, total_page } = useCourses({ page, q });

  const onCourseCreate = () => {
    modals.open({
      fullScreen: true,
      lockScroll: true,
      closeOnEscape: false,
      withCloseButton: false,
      portalProps: { style: { padding: 0 } },
      withinPortal: true,
      children: <CourseCreationDialog />,
    });
  };

  const onSearch = debounce((ev: ChangeEvent<HTMLInputElement>) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: 1,
        q: ev.target.value,
      },
    });
  }, 200);

  const onPageChange = (page: number) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page,
      },
    });
  };

  return (
    <div>
      <PanelHeader
        title={commonT('common.words.courses')}
        downSection={
          <Flex justify="space-between" align="center">
            <TextInput
              size="md"
              placeholder={commonT('common.words.search')}
              defaultValue={q}
              onChange={(ev) => onSearch(ev)}
              rightSection={
                <ActionIcon>
                  <IconSearch size="15" />
                </ActionIcon>
              }
            />
            <Button onClick={onCourseCreate}>
              {commonT('common.labels.create', {
                feature: commonT('common.words.course'),
              })}
            </Button>
          </Flex>
        }
      />

      <SimpleGrid cols={2} mt="lg">
        {isLoading ? (
          <>
            <Skeleton h={40} />
            <Skeleton h={40} />
            <Skeleton h={40} />
            <Skeleton h={40} />
          </>
        ) : (
          courses?.map((course) => (
            <TeacherCourseCard key={course?._id} {...course} />
          ))
        )}
      </SimpleGrid>
      {total_page > 1 ? (
        <Center mt="xl">
          <Pagination total={total_page} onChange={onPageChange} />
        </Center>
      ) : null}
    </div>
  );
};

export default CoursesPage;
