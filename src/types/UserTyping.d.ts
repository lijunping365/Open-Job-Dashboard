export type User = {
  id: number;
  username: string;
  avatar: string;
  status: number;
  phone: string;
  github?: string;
  email?: string;
  desc?: string;
  createTime: Date;
  admin?: number;
};
