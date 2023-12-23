import { getAccessToken } from '@/lib/cache';
import { request, PageResult } from '@/lib/request';
import {
  CaptchaParams,
  ChartParam,
  CurrentUser,
  Instance,
  JobChartParam,
  LoginParams,
  OpenJob,
  OpenJobAlarm,
  OpenJobApp,
  OpenJobLog,
  User,
} from '@/types/typings';

/** 获取当前的用户 GET /user/currentUser */
export async function currentUser() {
  return request.get<CurrentUser>('/user/currentUser');
}

/** 登录接口 POST /login/list */
export async function login(body: LoginParams) {
  return request.post(`/login/${body.type}`, body);
}

/** 退出登录接口 POST /login/outLogin */
export async function outLogin() {
  return request.get('/login/outLogin', { accessToken: getAccessToken() });
}

/** 退出登录接口 GET /login/refreshToken */
export async function tryRefreshToken() {
  return request.get('/login/refreshToken');
}

export async function getFakeImageCaptcha(params: Partial<CaptchaParams>) {
  return request.post('/captcha/create/image', params);
}

export async function getFakeSmsCaptcha(params: Partial<CaptchaParams>) {
  return request.post('/captcha/create/sms', params);
}

export async function fetchUserPage(params: {
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  /** 任务名称 */
  name?: string;
}) {
  return request.get<PageResult<User>>('/user/page', params);
}

export async function updateUser(params: Partial<User>) {
  return request.put('/user/update', params);
}

export async function addUser(params: Partial<User>) {
  return request.post('/user/save', params);
}

export async function removeUser(params: { ids: number[] }) {
  return request.delete('/user/delete', params);
}

export async function fetchInstancePage(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  /** 实例id */
  address?: any;
  /** 应用id */
  appId?: any;
  /** 实例状态 */
  status?: number;
}) {
  return request.get<PageResult<Instance>>('/instance/page', params);
}

export async function fetchAllInstance(appId: any) {
  return request.get<Instance[]>('/instance/list', { appId });
}

export async function addInstance(params: Partial<Instance>) {
  return request.post('/instance/add', params);
}

export async function updateInstance(params: Partial<Instance>) {
  return request.put('/instance/update', params);
}

export async function removeInstance(params: { ids: number[] }) {
  return request.delete('/app/delete', params);
}

export async function fetchTaskLogPage(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  /** 任务id */
  jobId?: number;
  /** 任务状态 */
  status?: number;
  /** 任务执行时间 */
  createTime?: Date;
}) {
  return request.get<PageResult<OpenJobLog>>('/logger/page', params);
}

export async function removeTaskLog(params: { ids: number[] }) {
  return request.delete('/logger/delete', params);
}

export async function killScheduleTask(id: number) {
  return request.put(`/logger/killTask/${id}`, {});
}

export async function fetchAlarmRecordPage(params: {
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  /** 应用id */
  appId?: number;
  /** 任务id */
  jobId?: number;
  /** 报警时间 */
  createTime?: Date;
}) {
  return request.get<PageResult<OpenJobAlarm>>('/alarm/page', params);
}

export async function removeAlarmRecord(params: { ids: number[] }) {
  return request.delete('/alarm/delete', params);
}

export async function fetchScheduleTaskPage(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  /** 应用id */
  appId?: any;
  /** 任务状态 */
  status?: number;
}) {
  return request.get<PageResult<OpenJob>>('/task/page', params);
}

export async function updateScheduleTask(params: Partial<OpenJob>) {
  return request.put('/task/update', params);
}

export async function addScheduleTask(params: Partial<OpenJob>) {
  return request.post('/task/save', params);
}

export async function removeScheduleTask(params: { ids: number[] }) {
  return request.delete('/task/delete', params);
}

export async function startScheduleTask(id: number) {
  return request.put(`/task/start/${id}`, {});
}

export async function stopScheduleTask(id: number) {
  return request.put(`/task/stop/${id}`, {});
}

export async function runScheduleTask(id: number) {
  return request.put(`/task/run/${id}`, {});
}

export async function nextTriggerTime(cronExpress: string) {
  return request.get(`/task/nextTriggerTime`, {
    cronExpress,
  });
}

export async function fetchByJobName(jobName: string) {
  return request.get<OpenJob[]>(`/task/fetchByJobName`, {
    jobName,
  });
}

export async function fetchAnalysisNumber() {
  return request.get('/analysis/statistic');
}

export async function fetchAppAnalysisNumber(appId: number) {
  return request.get('/analysis/appStatistic', {
    appId,
  });
}

export async function fetchJobAnalysisNumber(appId: number, jobId: number) {
  return request.get('/analysis/jobStatistic', {
    appId,
    jobId,
  });
}

export async function fetchInstanceAnalysisNumber(
  appId: number,
  serverId: string
) {
  return request.get('/analysis/instanceStatistic', {
    appId,
    serverId,
  });
}

export async function fetchAnalysisChart(params: ChartParam) {
  return request.get('/analysis/chart', params);
}

export async function fetchJobTimeChart(params: JobChartParam) {
  return request.get('/analysis/jobChart', params);
}

export async function validateCronExpress(cronExpress: string) {
  return request.get(`/task/validateCron`, {
    cronExpress,
  });
}

export async function fetchOpenJobAppPage(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  /** 应用名称 */
  appName?: any;
  /** 任务状态 */
  status?: number;
}) {
  return request.get<PageResult<OpenJobApp>>('/app/page', params);
}

export async function updateOpenJobApp(params: Partial<OpenJob>) {
  return request.put('/app/update', params);
}

export async function addOpenJobApp(params: Partial<OpenJob>) {
  return request.post('/app/save', params);
}

export async function removeOpenJobApp(params: { ids: number[] }) {
  return request.delete('/app/delete', params);
}

export async function fetchOpenJobAppList(appName?: string) {
  return request.get<OpenJobApp[]>('/app/list', { appName });
}
