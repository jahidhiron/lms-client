import { Box, Text } from '@mantine/core';
import CourseEditPageHeader from '~/components/headers/CourseEditPageHeader';
import CourseBasicInfoForm from '~/components/pages/course/course-landing-page/CourseBasicInfoForm';
import useTranslation from '~/hooks/use-translation';

const BasicsPage = () => {
  const { t: commonT } = useTranslation('common');
  const { t: basicsT } = useTranslation('basics');
  return (
    <Box px="xl">
      <CourseEditPageHeader
        title={commonT('common.course-navigation.course-landing-page')}
      />
      <Text my="sm">{basicsT('basics-message')}</Text>

      <CourseBasicInfoForm />
    </Box>
  );
};

export default BasicsPage;
