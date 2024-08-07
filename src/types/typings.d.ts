import { TablePaginationConfig } from 'antd';
import { FilterValue } from 'antd/es/table/interface';

export interface User {
  id: number;
  username: string;
  status: number;
  avatar: string;
  createTime: Date;
}

export interface Instance {
  id: number;
  serverId: string;
  onlineTime: Date;
  liveTime: string;
  cpuInfo: string;
  memoryInfo: string;
  diskInfo: string;
  status: number;
  weight: number;
}

export interface StatisticNumber {
  alarmNum: number;
  status: string;
  taskTotalNum: number;
  taskStartedNum: number;
  executorTotalNum: number;
  executorOnlineNum: number;
  taskExecuteTotalNum: number;
  taskExecuteSuccessNum: number;
  taskNextExecuteTime: string;
  taskTakeTime: string;
}

export interface OpenJobLog {
  id: number;
  appId: number;
  jobId: number;
  status: number;
  cause: string;
  serverId: string;
  createTime: Date;
  startTime: Date;
  finishTime: Date;
  takeTime: number;
}

export interface OpenJobApp {
  id: number;
  appName: string;
  appDesc: string;
  createTime: Date;
  createUser: number;
}

export interface OpenJobAlarm {
  id: number;
  appId: number;
  jobId: number;
  serverId: string;
  message: string;
  receiver: number;
  createTime: Date;
}

export interface OpenJob {
  id: number;
  appId: number;
  jobName: string;
  handlerName: string;
  cronExpression: string;
  sharding: number;
  scriptLang: string;
  params: string;
  script: string;
  status: number;
  createTime: Date;
  createUser: number;
}

export interface OpenJobPrompt {
  id: number;
  prompt: string;
  updateTime: Date;
}

export interface CurrentUser {
  username?: string;
  avatar?: string;
  userid?: string;
  email?: string;
  signature?: string;
  title?: string;
  group?: string;
  tags?: { key?: string; label?: string }[];
  notifyCount?: number;
  unreadCount?: number;
  country?: string;
  access?: string;
  geographic?: {
    province?: { label?: string; key?: string };
    city?: { label?: string; key?: string };
  };
  address?: string;
  phone?: string;
}

export interface LoginResult {
  status?: string;
  type?: string;
  currentAuthority?: string;
}

export interface PageParams {
  current?: number;
  pageSize?: number;
}

export interface CaptchaParams {
  deviceId?: string;
  mobile?: string;
}

export interface LoginParams {
  username?: string;
  password?: string;
  deviceId?: string;
  mobile?: string;
  captcha?: string;
  type?: string;
}

export interface JobHandler {
  value?: string;
  name?: string;
}

export interface ChartParam {
  jobId?: string;
  period?: string;
}

export interface JobChartParam {
  jobId?: string;
  count?: number;
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  order?: any;
  filters?: Record<string, FilterValue>;
}

export interface AnalysisChart {
  labels: string[];
  totalCount: string[];
  successCount: string[];
}

export interface JobTimeChart {
  labels: string[];
  takeTime: string[];
  status: number[];
}

export type TimeType = '1m' | '30m' | '1h' | '24h' | '7d' | '30d' | '90d';

export type ChartTimeType = 30 | 60 | 180;

export enum LangType {
  EN_US = 'en-us',
  ZH_CN = 'zh-cn',
}

export interface ChatRequest {
  prompt?: string;
  usingContext?: boolean;
}

export type ChatType = 'user' | 'assistant';

export type ChatItem = {
  chatId: number;
  content: string;
  date: string;
  type: ChatType;
};

export interface ChatConfigType {
  prompt?: string;
  usingContext?: boolean;
}
