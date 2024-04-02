import {
  Alert,
  Anchor,
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  List,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDebounceCallback } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import {
  IconPhoto,
  IconTimelineEventExclamation,
  IconVideo,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import FileUploader from '~/components/core/FileUploader';
import TextEditor from '~/components/core/TextEditor';
import TextInput from '~/components/core/TextInput';
import { useCourse } from '~/features/course/use-course';
import { FileModel } from '~/features/file/file.model';
import { useProfile } from '~/features/profile/use-profile';
import {
  FILE_TYPE_THUMBNAIL,
  FILE_TYPE_VIDEO,
  TITLE_MAX_CHAR,
} from '~/helpers/constants';
import { Languages } from '~/helpers/languages';
import { Levels } from '~/helpers/levels';
import {
  autoUpdateTrigger,
  getStaticContentUrl,
  isEmptyObject,
} from '~/helpers/utils';
import useSelectCategories from '~/hooks/use-select-categories';
import useSelectSubCategories from '~/hooks/use-select-subcategories';
import { useCourseFormContext } from '~/libs/providers/CourseFormProvider';

type CourseBasicInfoFormProps = {};

export default function CourseBasicInfoForm({}: CourseBasicInfoFormProps) {
  const router = useRouter();
  const form = useCourseFormContext();
  const courseId = router.query?.cid as string;
  const { course } = useCourse({ id: courseId });
  const [thumbnail, setThumbnail] = useState<FileModel | undefined>();
  const [promotionalVideo, setPromotionalVideo] = useState<
    FileModel | undefined
  >();
  const isDirty = useMemo(
    () =>
      form.values.title !== course?.title ||
      form.values.subTitle !== course?.subTitle ||
      form.values.desc !== course?.desc ||
      form.values.language !== course?.language ||
      form.values.level !== course?.level ||
      form.values.subCategoryId !== course?.subCategoryId ||
      form.values.categoryId !== course?.categoryId,
    [form, course]
  );
  // const { ConfirmLeaveModal } = useConfirmLeave({
  //   shouldWarn: isDirty,
  // });
  const { SelectCategories } = useSelectCategories();
  const { SelectSubCategories } = useSelectSubCategories({
    categoryId: form.values.categoryId,
  });
  const { profile } = useProfile();
  const onFileUpload = (field: 'thumbnailId' | 'promotionalVideoId') => () => {
    modals.open({
      size: 'lg',
      children: (
        <FileUploader
          fileType={
            field === 'thumbnailId' ? FILE_TYPE_THUMBNAIL : FILE_TYPE_VIDEO
          }
          onDone={(files) => {
            form.setFieldValue(field, files?.at(0)?._id!);
            if (field === 'thumbnailId') {
              setThumbnail(files[0]);
            } else {
              setPromotionalVideo(files[0]);
            }
            modals.closeAll();
            autoUpdateTrigger(form);
          }}
        />
      ),
    });
  };

  const update = useDebounceCallback(() => {
    // @ts-ignore
    form.submitBtnRef?.click();
  }, 3000);

  useEffect(() => {
    if (!thumbnail && course?.thumbnail) {
      setThumbnail(
        !isEmptyObject(course?.thumbnail) ? course?.thumbnail : undefined
      );
    }
    if (!promotionalVideo && course?.promotionalVideo) {
      setPromotionalVideo(
        !isEmptyObject(course?.promotionalVideo)
          ? course?.promotionalVideo
          : undefined
      );
    }
  }, [course, thumbnail, promotionalVideo]);

  useEffect(() => {
    if (isDirty) {
      update();
    }
  }, [
    form.values.title,
    form.values.subTitle,
    form.values.desc,
    form.values.language,
    form.values.level,
    form.values.subCategoryId,
    form.values.categoryId,
    course,
  ]);

  return (
    <Stack>
      {/* <ConfirmLeaveModal /> */}
      <TextInput
        label="Course Title"
        description="Your title should be a mix of attention-grabbing, informative, and optimized for search"
        withCount
        size="md"
        labelProps={{ fw: 'bold' }}
        maxLength={TITLE_MAX_CHAR}
        {...form.getInputProps('title')}
      />

      <TextInput
        label="Course SubTitle"
        description="Use 1 or 2 related keywords, and mention 3-4 of the most important areas that you've covered during your course."
        withCount
        size="md"
        labelProps={{ fw: 'bold' }}
        maxLength={TITLE_MAX_CHAR}
        {...form.getInputProps('subTitle')}
      />
      <TextEditor
        label="Course Description"
        description="Description should have minimum 200 words"
        value={form.values.desc}
        onChange={(value) => form.setFieldValue('desc', value)}
        labelProps={{ fw: 'bold' }}
        withHeading
        withLink
        withList
        withTypography
      />
      <Box>
        <Title order={5}>Basic Info</Title>
        <Flex align="flex-start" w="100%" gap="sm">
          <Select
            allowDeselect={false}
            searchable
            data={Languages}
            size="md"
            w="100%"
            {...form.getInputProps('language')}
          />
          <Select
            w="100%"
            allowDeselect={false}
            data={Levels}
            searchable
            placeholder="Select Level"
            size="md"
            {...form.getInputProps('level')}
          />
          <Stack w="100%">
            <SelectCategories
              allowDeselect={false}
              label={undefined}
              placeholder="Select Category"
              clearable={false}
              size="md"
              {...form.getInputProps('categoryId')}
            />
            <SelectSubCategories
              label={undefined}
              allowDeselect={false}
              clearable={false}
              placeholder="Select SubCategory"
              size="md"
              {...form.getInputProps('subCategoryId')}
            />
          </Stack>
        </Flex>
      </Box>
      <Box>
        <Title order={5}>Course Image</Title>
        <Flex gap="lg" mt="xs">
          <Paper withBorder>
            <Image
              w={400}
              h={300}
              alt=""
              src={
                thumbnail
                  ? getStaticContentUrl(thumbnail?.path)
                  : '/placeholder.jpg'
              }
              style={{ objectFit: 'cover' }}
            />
          </Paper>
          <Box>
            <Text>
              Upload your course image here. It must meet our course image
              quality standards to be accepted. Important guidelines: 750x422
              pixels; .jpg, .jpeg,. gif, or .png. no text on the image.
            </Text>
            <Button
              mt="xs"
              leftSection={<IconPhoto size="20" />}
              fullWidth
              size="xs"
              onClick={onFileUpload('thumbnailId')}
            >
              Upload Image
            </Button>
          </Box>
        </Flex>
      </Box>
      <Box>
        <Title order={5}>Promotional Video</Title>
        <Flex gap="lg" mt="xs">
          <Paper withBorder>
            <video
              width={400}
              height={300}
              poster={!promotionalVideo ? '/placeholder.jpg' : undefined}
              src={
                promotionalVideo
                  ? getStaticContentUrl(promotionalVideo?.path)
                  : '/placeholder.jpg'
              }
              controls={!!promotionalVideo}
              style={{ objectFit: 'cover' }}
            />
          </Paper>
          <Box>
            <Text>
              Your promo video is a quick and compelling way for students to
              preview what they’ll learn in your course. Students considering
              your course are more likely to enroll if your promo video is
              well-made.
            </Text>
            <Button
              mt="xs"
              leftSection={<IconVideo size="20" />}
              fullWidth
              size="xs"
              onClick={onFileUpload('promotionalVideoId')}
            >
              Upload Video
            </Button>
          </Box>
        </Flex>
      </Box>
      <Box>
        <Title order={5}>Instructor Profile</Title>
        <List mt="xs">
          <List.Item
            icon={<Avatar src={getStaticContentUrl(profile?.avatar?.path!)} />}
          >
            {profile?.name}
          </List.Item>
          {!profile?.profileId && (
            <Alert
              mt="xs"
              icon={<IconTimelineEventExclamation />}
              title="Incomplete"
            >
              Your instructor biography must have at least 50 words.
              <br /> Your instructor image is required.
              <br />
              <Anchor size="xs">Update your Profile</Anchor>
            </Alert>
          )}
        </List>
      </Box>
    </Stack>
  );
}
