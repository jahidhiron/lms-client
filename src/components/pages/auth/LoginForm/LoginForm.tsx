import {
  Anchor,
  Button,
  Center,
  Checkbox,
  Flex,
  Group,
  PasswordInput,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconLogin } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, type FC } from 'react';
import { toast } from 'react-hot-toast';
import TextInput from '~/components/core/TextInput';
import RegisterDialog from '~/components/dialogs/RegisterDialog';
import AuthPageHeader from '~/components/headers/AuthPageHeader';
import { SignInReqBody } from '~/features/auth/auth.model';
import { signInSchema } from '~/features/auth/auth.validator';
import { useAuthMutations } from '~/features/auth/use-auth';
import useCartStore from '~/features/cart/use-cart.store';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import classes from './LoginForm.module.css';

interface LoginFormProps {
  title?: string;
  backUrl?: string | (() => void);
}

const LoginForm: FC<LoginFormProps> = ({ backUrl, title }) => {
  const router = useRouter();
  const { login } = useAuthMutations();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const email = (router?.query?.email as string) || '';
  const [loading, { close: closeLoading, open: openLoading }] =
    useDisclosure(false);
  const { t: authT } = useTranslation('auth');
  const { t: commonT } = useTranslation('common');
  const form = useForm<SignInReqBody>({
    validate: signInSchema,
    initialValues: {
      password: '',
      email,
      courseIds: [],
    },
  });
  useEffect(() => {
    form.setFieldValue('courseIds', cartItems?.map((item) => item.course?._id));
  }, [cartItems]);

  function onRegisterLinkPress() {
    if (router.pathname.includes('/auth')) {
      router.push('/auth/register');
      return;
    }
    modals.closeAll();
    modals.open({ children: <RegisterDialog /> });
  }

  return (
    <>
      <AuthPageHeader
        title={title || authT('auth.labels.login')}
        backUrl={backUrl}
      />

      <form
        onSubmit={form.onSubmit((values) => {
          openLoading();
          toast.promise(login(values), {
            loading: commonT('common.loading.login'),
            success(data) {
              closeLoading();
              clearCart();
              modals.closeAll();
              return data.message;
            },
            error(err) {
              closeLoading();
              return errorResolver(form)(err);
            },
          });
        })}
      >
        <TextInput
          withAsterisk
          label={commonT('common.words.email')}
          placeholder="example@mail.com"
          {...form.getInputProps('email')}
        />
        <PasswordInput
          withAsterisk
          label={commonT('common.words.password')}
          placeholder="*******"
          mt="sm"
          {...form.getInputProps('password')}
        />

        <Flex justify="space-between" mt="lg">
          <Checkbox label={authT('auth.remember_me')} />
          <Anchor size="sm" component={Link} href="/auth/forgot-password">
            {authT('auth.forgot-password')}
          </Anchor>
        </Flex>

        <Group mt="lg" justify="space-between" className={classes.controls}>
          <Center inline>
            <Text c="dimmed" size="sm" className={classes.control}>
              {authT('auth.labels.no-account?')}-
              <Anchor onClick={onRegisterLinkPress}>
                {authT('auth.labels.register')}
              </Anchor>
            </Text>
          </Center>
          <Button
            type="submit"
            className={classes.control}
            rightSection={<IconLogin />}
            loading={loading}
          >
            {authT('auth.login')}
          </Button>
        </Group>
      </form>
    </>
  );
};

export default LoginForm;
