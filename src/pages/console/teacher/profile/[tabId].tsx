import { Tabs } from '@mantine/core';
import { IconPhotoCirclePlus, IconUserEdit } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import PanelHeader from '~/components/headers/PanelHeader';
import ProfileInfoForm from '~/components/pages/profile/ProfileInfoForm';
import ProfilePictureForm from '~/components/pages/profile/ProfilePictureForm';
import useTranslation from '~/hooks/use-translation';

const ProfileInfoPage = () => {
  const router = useRouter();
  const tabId = router.query?.tabId as string;
  const { t: commonT } = useTranslation('common');
  return (
    <div>
      <PanelHeader title={commonT('common.labels.profile-and-settings')} />
      <Tabs
        value={tabId}
        onChange={(tabId) => {
          router.replace({
            pathname: router.pathname,
            query: {
              tabId,
            },
          });
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="basic-info" leftSection={<IconUserEdit size="20" />}>
            Profile Info
          </Tabs.Tab>
          <Tabs.Tab
            value="profile-picture"
            leftSection={<IconPhotoCirclePlus size="20" />}
          >
            Profile Picture
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="basic-info">
          <ProfileInfoForm />
        </Tabs.Panel>
        <Tabs.Panel value="profile-picture">
          <ProfilePictureForm />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default ProfileInfoPage;
