import { TimeType } from '@/types/typings';
import dayjs from 'dayjs';
import { MenuItem } from '@/components/Layout';

export const generateUUID = () => {
  const s: any[] = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i += 1) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] && 0x3) || 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = '-';
  s[13] = '-';
  s[18] = '-';
  s[23] = '-';
  return s.join('');
};

export const processTime = (searchForm: any, values: any) => {
  if (values.timeRange) {
    searchForm.startTime = dayjs(values.timeRange[0]).format(
      'YYYY-MM-DD HH:mm:ss'
    );
    searchForm.endTime = dayjs(values.timeRange[1]).format(
      'YYYY-MM-DD HH:mm:ss'
    );
  }
};

// iterates the route tree from the current route to find its ancestors for breadcrumbs
export const getBreadcrumbs = (
  path: string,
  routes: any[],
  breadcrumbs: any[]
) => {
  for (const route of routes) {
    if (route?.key === path) {
      breadcrumbs.push({ title: route?.label });
      if (route.children) {
        getBreadcrumbs(path, route?.children, breadcrumbs);
      }
      return;
    }
  }
};
