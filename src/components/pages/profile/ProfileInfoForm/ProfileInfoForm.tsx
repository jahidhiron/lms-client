import { Box, Button, Flex, SimpleGrid, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import TextEditor from '~/components/core/TextEditor';
import TextInput from '~/components/core/TextInput';
import { AddUpdateProfileModel } from '~/features/profile/profile.model';
import { addUpdateProfileSchema } from '~/features/profile/profile.validator';
import {
  useProfile,
  useProfileMutations,
} from '~/features/profile/use-profile';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';

type ProfileInfoFormProps = {};

export default function ProfileInfoForm({}: ProfileInfoFormProps) {
  const { profile } = useProfile();
  const { updateProfile } = useProfileMutations();
  const { t: commonT } = useTranslation('common');
  const form = useForm<AddUpdateProfileModel>({
    validate: addUpdateProfileSchema,
  });
  useEffect(() => {
    if (profile) {
      form.setValues({
        name: profile?.name,
        title: profile?.profile?.title,
        youtube: profile?.profile?.youtube,
        website: profile?.profile?.website,
        twitter: profile?.profile?.twitter,
        linkedIn: profile?.profile?.linkedIn,
        facebook: profile?.profile?.facebook,
        bio: profile?.profile?.bio,
      });
    }
  }, [profile]);

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        values.youtube = 'https://youtube.com/' + values.youtube;
        values.twitter = 'https://twitter.com/' + values.twitter;
        values.linkedIn = 'https://linkedin.com/' + values.linkedIn;
        values.facebook = 'https://facebook.com/' + values.facebook;
        toast.promise(updateProfile(values), {
          success: (data) => data.message,
          error: errorResolver(form),
          loading: commonT('common.loading.update', {
            feature: commonT('common.navigation.profile'),
            title: '',
          }),
        });
      })}
    >
      <SimpleGrid cols={2}>
        <Stack py="lg">
          <TextInput label="Full Name" {...form.getInputProps('name')} />
          <TextInput label="Heading" {...form.getInputProps('title')} />
          <TextEditor
            label="Biography"
            withTypography
            value={form.values.bio}
            onChange={(value) => {
              form.setFieldValue('bio', value);
            }}
            error={form?.errors?.bio as string}
          />
        </Stack>
        <Box>
          <Stack py="lg">
            <TextInput
              label="Website"
              type="url"
              {...form.getInputProps('website')}
            />
            <TextInput
              label="Facebook"
              prefix="https://facebook.com/"
              leftSectionWidth={180}
              styles={{ input: { paddingLeft: '190px' } }}
              leftSectionProps={{ style: { borderRight: '1px solid' } }}
              leftSection={
                <Flex align={'start'} w="100%" px="xs">
                  <Text>https://facebook.com/</Text>
                </Flex>
              }
              {...form.getInputProps('facebook')}
              value={form.values.facebook?.replace('https://facebook.com/', '')}
            />

            <TextInput
              label="Twitter"
              prefix="https://twitter.com/"
              leftSectionWidth={180}
              styles={{ input: { paddingLeft: '190px' } }}
              leftSectionProps={{ style: { borderRight: '1px solid' } }}
              leftSection={
                <Flex align={'start'} w="100%" px="xs">
                  <Text>https://twitter.com/</Text>
                </Flex>
              }
              {...form.getInputProps('twitter')}
              value={form.values.twitter?.replace('https://twitter.com/', '')}
            />
            <TextInput
              label="LinkedIn"
              prefix="https://linkedin.com/"
              leftSectionWidth={180}
              styles={{ input: { paddingLeft: '190px' } }}
              leftSectionProps={{ style: { borderRight: '1px solid' } }}
              leftSection={
                <Flex align={'start'} w="100%" px="xs">
                  <Text>https://linkedin.com/</Text>
                </Flex>
              }
              {...form.getInputProps('linkedIn')}
              value={form.values.linkedIn?.replace('https://linkedin.com/', '')}
            />
            <TextInput
              prefix="https://youtube.com/"
              label={'Youtube'}
              leftSectionWidth={180}
              leftSectionProps={{ style: { borderRight: '1px solid' } }}
              styles={{ input: { paddingLeft: '190px' } }}
              leftSection={
                <Flex align={'start'} w="100%" px="xs">
                  <Text>https://youtube.com/</Text>
                </Flex>
              }
              {...form.getInputProps('youtube')}
              value={form.values.youtube?.replace('https://youtube.com/', '')}
            />
          </Stack>
        </Box>
        <Box>
          <Button type="submit">Save</Button>
        </Box>
      </SimpleGrid>
    </form>
  );
}
