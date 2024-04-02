import { Group, Stack, ThemeIcon, Title } from '@mantine/core';
import { IconPaperclip, IconVideoPlus } from '@tabler/icons-react';
import { useState } from 'react';
import SelectButton from '~/components/core/SelectButton';
import { TYPE_COURSE, TYPE_PRACTICE_TEST } from '~/helpers/constants';
import useTranslation from '~/hooks/use-translation';

const SelectCourseType = () => {
  const { t: commonT } = useTranslation('common');
  const [courseType, setCourseType] = useState<number>(TYPE_COURSE);

  return (
    <Stack align="center" justify="center" p="lg">
      <Title>{commonT('common.steps.course-creation.step-1.title')}</Title>
      <Group>
        <SelectButton
          title={commonT('common.words.course')}
          description={commonT('common.messages.course-creation')}
          icon={
            <ThemeIcon>
              <IconVideoPlus size="15" />
            </ThemeIcon>
          }
          selected={courseType == TYPE_COURSE}
          onPress={() => setCourseType(TYPE_COURSE)}
        />
        <SelectButton
          title={commonT('common.words.practice-test')}
          description={commonT('common.messages.practice-creation')}
          disabled={true}
          icon={
            <ThemeIcon>
              <IconPaperclip size="15" />
            </ThemeIcon>
          }
          selected={courseType == TYPE_PRACTICE_TEST}
          onPress={() => setCourseType(TYPE_PRACTICE_TEST)}
        />
      </Group>
    </Stack>
  );
};

export default SelectCourseType;
