import { ActionIcon, Flex, Image, Overlay, Paper } from '@mantine/core';
import { IconPlayerPlay } from '@tabler/icons-react';
import { CourseModel } from '~/features/course/course.model';
import { FileModel } from '~/features/file/file.model';
import { getStaticContentUrl } from '~/helpers/utils';

type CourseIntroViewProps = {
  course?: CourseModel;
  openPreview: () => void;
};

export default function CourseIntroView({
  course,
  openPreview,
}: CourseIntroViewProps) {
  return (
    <Paper h="100%" pos="relative" p="3" bg="white" shadow="md">
      <Overlay zIndex={10}>
        <Flex h="100%" align="center" justify="center">
          <ActionIcon
            size="50"
            variant="outline"
            radius={'xl'}
            onClick={openPreview}
          >
            <IconPlayerPlay size={30} />
          </ActionIcon>
        </Flex>
      </Overlay>
      <Image
        radius="sm"
        src={getStaticContentUrl((course?.thumbnailId as FileModel)?.path)}
        alt="image"
      />
    </Paper>
  );
}
