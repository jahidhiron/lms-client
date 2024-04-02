import { HttpStatusCode } from 'axios';
import { ResponseType } from '~/helpers/shared-model';
import { UserModel } from '../user/user.model';

export type SignInReqBody = {
  email: string;
  password: string;
  courseIds?: string[];
};

export type SignInReqResp = ResponseType;

export type RegisterReqBody = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export type RegisterReqResp = ResponseType;

export type EmailVerificationReqBody = {
  email: string;
  code: string;
};
export type EmailVerificationReqResp = ResponseType;

export type ResendEmailVerificationCodeReqBody = {
  email: string;
};
export type ResendEmailVerificationCodeReqResp = ResponseType;

export type ForgotPasswordOTPSendReqBody = {
  email: string;
};
export type ForgotPasswordOTPSendReqResp = ResponseType;

export type ForgotPasswordVerificationReqBody = {
  email: string;
  code: string;
};

export type ForgotPasswordVerificationReqResp = ResponseType;

export type ChangePasswordReqBody = {
  oldPassword: string;
  newPassword: string;
};

export type ChangePasswordReqResp = ResponseType;

export type ResetPasswordReqBody = {
  email: string;
  code: string;
  password: string;
};

export type ContactMailSendReqBody = {
  email: string;
  subject: string;
  msg: string;
};

export type ResetPasswordReqResp = ResponseType;

export type LogoutReqResp = ResponseType;

export type LoggedInUserResp = {
  code: HttpStatusCode;
  status: 'success' | 'failed';
  name?: string;
  message: string;
  data?: {
    user: UserModel;
  };
};

export type MySession = UserModel;
