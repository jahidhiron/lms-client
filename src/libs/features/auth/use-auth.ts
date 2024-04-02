import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef } from 'react';
import { queryClient } from '~/helpers/config';
// import useAuthStore from '~/libs/store/useAuthStore';
import { AxiosError } from 'axios';
import {
  changePasswordAPI,
  emailVerificationAPI,
  forgotPasswordOTPSendAPI,
  forgotPasswordOTPVerifyAPI,
  loggedInUserAPI,
  logoutAPI,
  registerAPI,
  resendEmailVerificationAPI,
  resetPasswordAPI,
  sendContactEmailAPI,
  signInAPI,
} from './auth.api';
import {
  ChangePasswordReqBody,
  ContactMailSendReqBody,
  EmailVerificationReqBody,
  ForgotPasswordOTPSendReqBody,
  ForgotPasswordVerificationReqBody,
  MySession,
  RegisterReqBody,
  ResendEmailVerificationCodeReqBody,
  ResetPasswordReqBody,
  SignInReqBody,
} from './auth.model';

const QUERY_KEY = 'sessions';

// Controller
const useAuth = () => {
  const isLoaded = useRef<boolean>(false);
  const { data, error, errorUpdateCount } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => loggedInUserAPI(),
    refetchInterval: 1000 * 60 * 59,
    refetchIntervalInBackground: true,
    retry: 0,
  });
  // @ts-ignore
  const session: MySession = useMemo(
    () => ({
      ...(data?.data?.user || {}),
    }),
    [data]
  );

  useEffect(() => {
    // console.log('useAuth: ', data, isLoaded, errorUpdateCount, error);
    // if (error?.status == 401) {
    //   queryClient.removeQueries({queryKey: [QUERY_KEY]});
    // }
  }, [data, isLoaded, errorUpdateCount, error]);
  useEffect(() => {
    if (!data && errorUpdateCount == 0) {
      isLoaded.current = true;
    }
  }, [data, errorUpdateCount]);

  return {
    session,
    isAuthenticated: !!data?.data?.user && !error,
    isLoading: !isLoaded,
    error: error as AxiosError<{ name: string }>,
  };
};

export default useAuth;

export const useAuthMutations = () => {
  const router = useRouter();
  const registerMutation = useMutation({
    mutationFn: (data: RegisterReqBody) => registerAPI(data),
    onSuccess() {
      router.push(
        '/auth/verify-otp?type=email-verification',
        '/auth/verify-otp'
      );
    },
  });

  const register = async (data: RegisterReqBody) => {
    return registerMutation.mutateAsync(data);
  };

  const loginMutation = useMutation({
    mutationFn: (data: SignInReqBody) => signInAPI(data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
  const login = async (data: SignInReqBody) => {
    return loginMutation.mutateAsync(data);
  };

  const logoutMutation = useMutation({
    mutationFn: () => logoutAPI(),
    onSuccess() {
      router.replace('/');
      queryClient.setQueriesData({ queryKey: [QUERY_KEY] }, null);
      queryClient.setQueriesData({ queryKey: ['profiles'] }, null);
    },
  });
  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

  const forgotPasswordSendOTPMutation = useMutation({
    mutationFn: (data: ForgotPasswordOTPSendReqBody) =>
      forgotPasswordOTPSendAPI(data),
    onSuccess() {
      queryClient.removeQueries({ queryKey: [QUERY_KEY] });
    },
  });
  const forgotPasswordSendOTP = async (data: ForgotPasswordOTPSendReqBody) => {
    return forgotPasswordSendOTPMutation.mutateAsync(data);
  };

  const forgotPasswordVerifyOTPMutation = useMutation({
    mutationFn: (data: ForgotPasswordVerificationReqBody) =>
      forgotPasswordOTPVerifyAPI(data),
    onSuccess() {
      queryClient.removeQueries({ queryKey: [QUERY_KEY] });
    },
  });
  const forgotPasswordVerifyOTP = async (
    data: ForgotPasswordVerificationReqBody
  ) => {
    return forgotPasswordVerifyOTPMutation.mutateAsync(data);
  };

  const emailVerificationMutation = useMutation({
    mutationFn: (data: EmailVerificationReqBody) => emailVerificationAPI(data),
    onSuccess() {
      queryClient.removeQueries({ queryKey: [QUERY_KEY] });
    },
  });
  const emailVerification = async (data: EmailVerificationReqBody) => {
    return emailVerificationMutation.mutateAsync(data);
  };

  const resendEmailVerificationMutation = useMutation({
    mutationFn: (data: ResendEmailVerificationCodeReqBody) =>
      resendEmailVerificationAPI(data),
  });
  const resendEmailVerification = async (
    data: ResendEmailVerificationCodeReqBody
  ) => {
    return resendEmailVerificationMutation.mutateAsync(data);
  };

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordReqBody) => resetPasswordAPI(data),
  });
  const resetPassword = async (data: ResetPasswordReqBody) => {
    return resetPasswordMutation.mutateAsync(data);
  };

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordReqBody) => changePasswordAPI(data),
  });
  const changePassword = async (data: ChangePasswordReqBody) => {
    return changePasswordMutation.mutateAsync(data);
  };

  const contactSendEmailMutation = useMutation({
    mutationFn: (data: ContactMailSendReqBody) => sendContactEmailAPI(data),
  });
  const contactSendEmail = async (data: ContactMailSendReqBody) => {
    return contactSendEmailMutation.mutateAsync(data);
  };

  return {
    register,
    login,
    logout,
    forgotPasswordSendOTP,
    forgotPasswordVerifyOTP,
    emailVerification,
    resendEmailVerification,
    resetPassword,
    changePassword,
    contactSendEmail,
  };
};
