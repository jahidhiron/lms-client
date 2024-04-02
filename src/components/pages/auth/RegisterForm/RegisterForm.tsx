import {
  Anchor,
  Button,
  Center,
  Group,
  PasswordInput,
  SegmentedControl,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconSettingsUp } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useMemo, type FC } from 'react';
import toast from 'react-hot-toast';
import TextInput from '~/components/core/TextInput';
import LoginDialog from '~/components/dialogs/LoginDialog';
import AuthPageHeader from '~/components/headers/AuthPageHeader';
import { RegisterReqBody } from '~/features/auth/auth.model';
import { registerSchema } from '~/features/auth/auth.validator';
import { useAuthMutations } from '~/features/auth/use-auth';
import {
  ROLES,
  ROLE_STUDENT,
  ROLE_TEACHER,
  TIMER_MIN_KEY,
  TIMER_SEC_KEY,
} from '~/helpers/constants';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import classes from './RegisterForm.module.css';

interface RegisterFormProps {
  backUrl?: string | (() => void);
}

const RegisterForm: FC<RegisterFormProps> = ({ backUrl }) => {
  const router = useRouter();
  const { t: authT } = useTranslation('auth');
  const { t: commonT } = useTranslation('common');
  const { register } = useAuthMutations();
  const [loading, { close: closeLoading, open: openLoading }] =
    useDisclosure(false);
  const form = useForm<RegisterReqBody>({
    validate: registerSchema,
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: ROLE_STUDENT.toString(),
    },
  });
  function onLoginLinkPress() {
    if (router.pathname.includes('/auth')) {
      router.push('/auth/login');
      return;
    }
    modals.closeAll();
    modals.open({
      children: <LoginDialog />,
    });
  }

  return (
    <>
      <AuthPageHeader title={authT('auth.labels.register')} backUrl={backUrl} />

      <form
        onSubmit={form.onSubmit((values) => {
          openLoading();
          toast.promise(register(values), {
            loading: commonT('common.loading.register'),
            success(data) {
              closeLoading();
              sessionStorage.removeItem(TIMER_MIN_KEY);
              sessionStorage.removeItem(TIMER_SEC_KEY);
              router.push({
                pathname: '/auth/verify-otp',
                query: {
                  email: values.email,
                  type: 'email-verification',
                },
              });
              return data?.message;
            },
            error(error) {
              closeLoading();
              return errorResolver(form)(error);
            },
          });
        })}
      >
        <TextInput
          withAsterisk
          label={commonT('common.words.name')}
          placeholder="Mr Abc"
          {...form.getInputProps('name')}
        />

        <TextInput
          withAsterisk
          label={commonT('common.words.email')}
          placeholder="example@mail.com"
          mt="sm"
          {...form.getInputProps('email')}
        />

        <PasswordInput
          withAsterisk
          label={commonT('common.words.password')}
          mt="sm"
          placeholder="*******"
          {...form.getInputProps('password')}
        />

        <PasswordInput
          withAsterisk
          label={commonT('common.words.confirm_password')}
          placeholder="*******"
          mt="sm"
          {...form.getInputProps('confirm_password')}
        />

        <SegmentedControl
          mt="sm"
          fullWidth
          color="orange"
          data={useMemo(
            () => [
              { label: ROLES[ROLE_STUDENT], value: ROLE_STUDENT.toString() },
              { label: ROLES[ROLE_TEACHER], value: ROLE_TEACHER.toString() },
            ],
            []
          )}
          {...form.getInputProps('role')}
        />
        <Group mt="lg" justify="space-between" className={classes.controls}>
          <Center inline>
            <Text c="dimmed" size="sm" className={classes.control}>
              {authT('auth.labels.have-account?')}-
              <Anchor onClick={onLoginLinkPress}>
                {authT('auth.labels.login')}
              </Anchor>
            </Text>
          </Center>
          <Button
            type="submit"
            className={classes.control}
            rightSection={<IconSettingsUp />}
            loading={loading}
          >
            {authT('auth.register')}
          </Button>
        </Group>
      </form>
    </>
  );
};

export default RegisterForm;
