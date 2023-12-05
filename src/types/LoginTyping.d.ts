export type LoginParams = {
  username?: string;
  password?: string;
  deviceId?: string;
  mobile?: string;
  captcha?: string;
  type?: string;
};

export type RegisterParams = {
  username: string;
  password: string;
  deviceId: string;
  confirmPassword?: string;
};

export type CaptchaParams = {
  deviceId?: string;
  mobile?: string;
};
