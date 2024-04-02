import { Box } from '@mantine/core';
import CourseQAManagePageHeader from '~/components/headers/CourseEditPageHeader';
import ManageQA from '~/components/pages/communication/qa/ManageQA';
import useTranslation from '~/hooks/use-translation';

const ManagePage = () => {
  const { t: commonT } = useTranslation('common');
  return (
    <Box px="xl">
      <CourseQAManagePageHeader
        title={commonT('common.course-navigation.course-landing-page')}
      />

      <ManageQA />
    </Box>
  );
};

export default ManagePage;
