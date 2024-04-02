import { axios } from '~/helpers/config';
import type {
  ChangePasswordReqBody,
  ChangePasswordReqResp,
  ContactMailSendReqBody,
  EmailVerificationReqBody,
  EmailVerificationReqResp,
  ForgotPasswordOTPSendReqBody,
  ForgotPasswordOTPSendReqResp,
  ForgotPasswordVerificationReqBody,
  ForgotPasswordVerificationReqResp,
  LoggedInUserResp,
  LogoutReqResp,
  RegisterReqBody,
  RegisterReqResp,
  ResendEmailVerificationCodeReqBody,
  ResendEmailVerificationCodeReqResp,
  ResetPasswordReqBody,
  ResetPasswordReqResp,
  SignInReqBody,
  SignInReqResp,
} from './auth.model';

// API Endpoints
export const signInAPI = (data: SignInReqBody) =>
  axios.post<SignInReqResp>('/auth/signin', data).then((data) => data.data);

export const registerAPI = (data: RegisterReqBody) =>
  axios.post<RegisterReqResp>('/auth/signup', data).then((data) => data.data);

export const logoutAPI = () =>
  axios.get<LogoutReqResp>('/auth/signout').then((data) => data.data);

export const emailVerificationAPI = (data: EmailVerificationReqBody) =>
  axios
    .post<EmailVerificationReqResp>('/auth/verify-email', data)
    .then((data) => data.data);

export const resendEmailVerificationAPI = (
  data: ResendEmailVerificationCodeReqBody
) =>
  axios
    .post<ResendEmailVerificationCodeReqResp>('/auth/send-code-to-email', data)
    .then((data) => data.data);

export const forgotPasswordOTPSendAPI = (data: ForgotPasswordOTPSendReqBody) =>
  axios
    .post<ForgotPasswordOTPSendReqResp>('/auth/forgot-password', data)
    .then((data) => data.data);

export const forgotPasswordOTPVerifyAPI = (
  data: ForgotPasswordVerificationReqBody
) =>
  axios
    .post<ForgotPasswordVerificationReqResp>(
      '/auth/verify-forgot-password-code',
      data
    )
    .then((data) => data.data);

export const changePasswordAPI = (data: ChangePasswordReqBody) =>
  axios
    .post<ChangePasswordReqResp>('/auth/change-password', data)
    .then((data) => data.data);

export const resetPasswordAPI = (data: ResetPasswordReqBody) =>
  axios
    .post<ResetPasswordReqResp>('/auth/reset-password', data)
    .then((data) => data.data);

export const loggedInUserAPI = () =>
  axios.get<LoggedInUserResp>('/auth/current').then((data) => data.data);

export const refreshTokenAPI = () =>
  axios.get<LoggedInUserResp>('/auth/refresh-token').then((data) => data.data);

export const sendContactEmailAPI = (data: ContactMailSendReqBody) =>
  axios
    .post<ContactMailSendReqBody>('/auth/send-contact-email', data)
    .then((data) => data.data);
