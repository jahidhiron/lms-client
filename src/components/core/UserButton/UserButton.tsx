import {
  Avatar,
  Button,
  Group,
  Menu,
  Text,
  UnstyledButton,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import {
  IconBook2,
  IconChevronRight,
  IconDashboard,
  IconListCheck,
  IconLogin2,
  IconLogout2,
  IconRegistered,
  IconShoppingCart,
} from '@tabler/icons-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import LoginDialog from '~/components/dialogs/LoginDialog';
import RegisterDialog from '~/components/dialogs/RegisterDialog';
import useAuth, { useAuthMutations } from '~/features/auth/use-auth';
import { useProfile } from '~/features/profile/use-profile';
import {
  DEFAULT_REDIRECT_PATH,
  ROLES,
  ROLE_ADMIN,
  ROLE_STUDENT,
  ROLE_TEACHER,
} from '~/helpers/constants';
import { errorResolver, getStaticContentUrl } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import classes from './UserButton.module.css';

function UserButton() {
  const { profile } = useProfile();
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, { open: menuOpen, close: menuClose }] = useDisclosure();
  const { t: authT } = useTranslation('auth');
  const { t: commonT } = useTranslation('common');
  const { logout } = useAuthMutations();

  function onLogin() {
    menuClose();
    modals.open({
      children: <LoginDialog />,
    });
  }
  function onRegister() {
    menuClose();
    modals.open({
      children: <RegisterDialog />,
    });
  }

  const authorizedMenu = (
    <>
      <Menu.Item
        leftSection={
          {
            [ROLE_TEACHER]: <IconDashboard />,
            [ROLE_STUDENT]: <IconBook2 />,
            [ROLE_ADMIN]: <IconDashboard />,
          }[profile?.role!]
        }
        component={Link}
        href={DEFAULT_REDIRECT_PATH[profile?.role!]}
      >
        {
          {
            [ROLE_ADMIN]: commonT('common.navigation.profile'),
            [ROLE_STUDENT]: commonT('common.labels.my-learning'),
            [ROLE_TEACHER]: commonT('common.navigation.profile'),
          }[profile?.role!]
        }
      </Menu.Item>
      <Menu.Item
        leftSection={<IconShoppingCart />}
        component={Link}
        href={'/cart'}
      >
        {commonT('common.labels.my-cart')}
      </Menu.Item>
      {profile?.role === ROLE_STUDENT && (
        <Menu.Item
          leftSection={<IconListCheck />}
          component={Link}
          href="/console/student/my-courses/wishlist"
        >
          {commonT('common.labels.wishlist')}
        </Menu.Item>
      )}
      <Button
        fullWidth
        my={5}
        mt="xs"
        variant="outline"
        leftSection={<IconLogout2 />}
        onClick={() => {
          toast.promise(logout(), {
            success: (data) => {
              modals.closeAll();
              return data.message;
            },
            error: (error) => {
              return errorResolver()(error);
            },
            loading: commonT('common.loading.logout'),
          });
        }}
      >
        {authT('auth.logout')}
      </Button>
    </>
  );
  const unAuthorizedMenu = (
    <>
      <Button
        fullWidth
        leftSection={<IconLogin2 />}
        variant="light"
        onClick={onLogin}
        mb="xs"
      >
        {authT('auth.login')}
      </Button>
      <Button fullWidth leftSection={<IconRegistered />} onClick={onRegister}>
        {authT('auth.register')}
      </Button>{' '}
    </>
  );

  // if (!isAuthenticated) {
  //   return (
  //     <Flex gap="sm">
  //       <Button leftSection={<IconLogin2 />} variant="light" onClick={onLogin}>
  //         {authT('auth.login')}
  //       </Button>
  //       <Button leftSection={<IconRegistered />} onClick={onRegister}>
  //         {authT('auth.register')}
  //       </Button>
  //     </Flex>
  //   );
  // }

  return (
    <Menu width={200} opened={isMenuOpen} onOpen={menuOpen} onClose={menuClose}>
      <Menu.Target>
        <UnstyledButton className={classes.user}>
          <Group>
            <Avatar
              radius="xl"
              src={getStaticContentUrl(profile?.avatar?.path || '')}
            />

            {isAuthenticated && (
              <>
                <div style={{ flex: 1, width: 130 }}>
                  <Text size="sm" fw={500} lineClamp={1}>
                    {profile?.name}
                  </Text>

                  <Text c="dimmed" size="xs" lineClamp={1}>
                    {ROLES[profile?.role!]}
                  </Text>
                </div>
                <IconChevronRight
                  style={{ width: rem(14), height: rem(14) }}
                  stroke={1.5}
                />
              </>
            )}
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown p="xs">
        {isAuthenticated ? authorizedMenu : unAuthorizedMenu}
      </Menu.Dropdown>
    </Menu>
  );
}

export default UserButton;
