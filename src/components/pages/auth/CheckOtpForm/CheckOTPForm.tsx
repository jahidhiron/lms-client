import { Button, Flex, PinInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconFocus2, IconLogout } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, type FC } from 'react';
import toast from 'react-hot-toast';
import TimerButton from '~/components/core/TimerButton';
import AuthPageHeader from '~/components/headers/AuthPageHeader';
import {
  EmailVerificationReqBody,
  ForgotPasswordVerificationReqBody,
} from '~/features/auth/auth.model';
import { checkOTPSchema } from '~/features/auth/auth.validator';
import useAuth, { useAuthMutations } from '~/features/auth/use-auth';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import classes from './CheckOtpForm.module.css';

interface VerifyOTPFormProps {}

const VerifyOTPForm: FC<VerifyOTPFormProps> = () => {
  const router = useRouter();
  const [loading, { close: closeLoading, open: openLoading }] =
    useDisclosure(false);
  const { t: authT } = useTranslation('auth');
  const { t: commonT } = useTranslation('common');
  const { isAuthenticated } = useAuth();
  const {
    emailVerification,
    forgotPasswordVerifyOTP,
    forgotPasswordSendOTP,
    resendEmailVerification,
    logout,
  } = useAuthMutations();

  const OTPtype = router?.query?.type as
    | 'email-verification'
    | 'forgot-password';
  const email = router?.query?.email as string;
  const form = useForm<
    ForgotPasswordVerificationReqBody | EmailVerificationReqBody
  >({
    validate: checkOTPSchema,
    initialValues: {
      code: '',
      email: email,
    },
  });

  useEffect(() => {
    if (!form.values.email) {
      form.setFieldValue('email', email);
    }
  }, [email, form.values.email]);

  return (
    <>
      <AuthPageHeader title={authT('auth.labels.verify-otp-code')} />

      <form
        onSubmit={form.onSubmit((values) => {
          const api =
            OTPtype == 'email-verification'
              ? emailVerification
              : forgotPasswordVerifyOTP;
          openLoading();
          toast.promise(api(values), {
            loading: commonT('common.loading.validate'),
            success() {
              closeLoading();
              if (OTPtype === 'forgot-password') {
                router.replace({
                  pathname: '/auth/reset-password',
                  query: { email, code: values.code },
                });
              } else {
                if (!isAuthenticated) {
                  router.replace({ pathname: '/auth/login', query: { email } });
                } else {
                  router.replace('/');
                }
              }
              return '';
            },
            error(error) {
              closeLoading();
              return errorResolver()(error);
            },
          });
        })}
      >
        <Flex align="center" justify="center">
          <PinInput length={6} size="lg" {...form.getInputProps('code')} />
        </Flex>

        <Flex gap="xs" mt="lg" align="center" justify="space-between" w="100%">
          <TimerButton
            initialTimer={{ minute: 4, second: 59 }}
            triggerOnMount={OTPtype == 'email-verification'}
            onPress={(res, rej) => {
              const api =
                OTPtype == 'email-verification'
                  ? resendEmailVerification
                  : forgotPasswordSendOTP;
              toast.promise(api({ email: email }), {
                loading: commonT('common.loading.send'),
                error(_error) {
                  rej();
                  return errorResolver()(_error);
                },
                success(_data) {
                  res();
                  return _data?.message || '';
                },
              });
            }}
            placeholder={commonT('common.words.resend')}
          />
          <Button
            loading={loading}
            type="submit"
            fullWidth
            w={150}
            className={classes.control}
            rightSection={<IconFocus2 />}
          >
            {commonT('common.words.submit')}
          </Button>
          {isAuthenticated && OTPtype == 'email-verification' ? (
            <Button
              w={150}
              fullWidth
              className={classes.control}
              rightSection={<IconLogout />}
              color="red"
              onClick={() => {
                logout().then(() => router.replace('/'));
              }}
              variant="outline"
            >
              {authT('auth.logout')}
            </Button>
          ) : null}
        </Flex>
      </form>
    </>
  );
};

export default VerifyOTPForm;
