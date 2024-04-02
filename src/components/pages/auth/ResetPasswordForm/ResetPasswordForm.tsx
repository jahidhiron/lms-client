import { Anchor, Box, Button, Flex, Group, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowLeft, IconCubeSend } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type FC } from 'react';
import toast from 'react-hot-toast';
import AuthPageHeader from '~/components/headers/AuthPageHeader';
import { ResetPasswordReqBody } from '~/features/auth/auth.model';
import { resetPasswordSchema } from '~/features/auth/auth.validator';
import { useAuthMutations } from '~/features/auth/use-auth';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import classes from './ResetPasswordForm.module.css';

interface ResetPasswordFormProps {}

const ResetPasswordForm: FC<ResetPasswordFormProps> = () => {
  const router = useRouter();
  const [loading, { close: closeLoading, open: openLoading }] =
    useDisclosure(false);
  const email = (router?.query?.email as string) || '';
  const code = (router?.query?.code as string) || '';
  const { t: authT } = useTranslation('auth');
  const { t: commonT } = useTranslation('common');
  const { resetPassword } = useAuthMutations();
  const form = useForm<ResetPasswordReqBody & { confirm_password: string }>({
    validate: resetPasswordSchema,
    initialValues: {
      email,
      code,
      password: '',
      confirm_password: '',
    },
  });

  // useEffect(() => {
  //   if (!email || !code) {
  //     router.replace('/');
  //   }
  // }, []);

  return (
    <>
      <AuthPageHeader title={authT('auth.reset-password') + ' !'} />

      <form
        onSubmit={form.onSubmit((values) => {
          openLoading();
          toast.promise(resetPassword(values), {
            loading: commonT('common.loading.update'),
            success(data) {
              closeLoading();
              router.replace({ pathname: '/auth/login', query: { email } });
              return data?.message;
            },
            error(error) {
              closeLoading();
              return errorResolver(form)(error);
            },
          });
        })}
      >
        <PasswordInput
          withAsterisk
          label={commonT('common.words.password')}
          placeholder="*******"
          mt="sm"
          {...form.getInputProps('password')}
        />
        <PasswordInput
          withAsterisk
          label={commonT('common.words.confirm_password')}
          placeholder="*******"
          mt="sm"
          {...form.getInputProps('confirm_password')}
        />

        <Group mt="lg" justify="space-between" className={classes.controls}>
          <Anchor c="dimmed" size="sm" component={Link} href="/auth/login">
            <Flex>
              <IconArrowLeft stroke={1.5} />
              <Box ml={5}>{authT('auth.labels.back-to-login')}</Box>
            </Flex>
          </Anchor>
          <Button
            type="submit"
            loading={loading}
            className={classes.control}
            rightSection={<IconCubeSend />}
          >
            {authT('auth.send-otp')}
          </Button>
        </Group>
      </form>
    </>
  );
};

export default ResetPasswordForm;
