import { Box, Center, Flex, Image, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DropzoneContainer from '~/components/core/DropzoneContainer';
import { FileModel } from '~/features/file/file.model';
import {
  useProfile,
  useProfileMutations,
} from '~/features/profile/use-profile';
import { FILE_TYPE_AVATAR } from '~/helpers/constants';
import { errorResolver, getStaticContentUrl } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';

type ProfilePictureFormProps = {};

export default function ProfilePictureForm({}: ProfilePictureFormProps) {
  const { profile } = useProfile();
  const { t: commonT } = useTranslation('common');
  const { updateProfile } = useProfileMutations();

  const [avatar, setAvatar] = useState<FileModel>();
  useEffect(() => {
    setAvatar(profile?.avatar);
  }, [profile]);

  return (
    <Box p="xs">
      <Flex align={'center'}>
        <Stack>
          <Box>
            <Title order={6}>Image Preview</Title>
            <Text size="xs" c="dimmed">
              Minimum 200x200 pixels, Maximum 6000x6000 pixels
            </Text>
          </Box>
          <Image
            w={300}
            src={
              avatar ? getStaticContentUrl(avatar?.path) : '/placeholder.jpg'
            }
            alt=""
          />
        </Stack>
        <Center w="100%" px="md">
          <DropzoneContainer
            fileType={FILE_TYPE_AVATAR}
            onDone={(files, viewReset) => {
              setAvatar(files[0]);
              toast
                .promise(
                  updateProfile({
                    name: profile?.name || '',
                    title: profile?.profile?.title || '',
                    youtube: profile?.profile?.youtube || '',
                    website: profile?.profile?.website || '',
                    twitter: profile?.profile?.twitter || '',
                    linkedIn: profile?.profile?.linkedIn || '',
                    facebook: profile?.profile?.facebook || '',
                    bio: profile?.profile?.bio || '',
                    avatarId: files[0]?._id,
                  }),
                  {
                    success: (data) => data.message,
                    error: errorResolver(),
                    loading: commonT('common.loading.update', {
                      feature: commonT('common.navigation.profile'),
                      title: '',
                    }),
                  }
                )
                .finally(() => {
                  viewReset();
                });
            }}
          />
        </Center>
      </Flex>
    </Box>
  );
}
