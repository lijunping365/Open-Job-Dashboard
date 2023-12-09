import { RouteItem, RouteMeta } from '@/types/MenuTyping';

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

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) return str;
  try {
    if (str.includes('.') && !str.includes(' ')) {
      return new URL(`https://${str}`).toString();
    }
  } catch (e) {
    return null;
  }
}

// upload image
export function uploadImage(callback: any) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async () => {
    if (input.files?.length) {
      const file = input.files[0];
      callback(file);
    }
  };
  input.click();
}

export function getRouteMeta(cleanedPath: string, routeTree: RouteItem) {
  const breadcrumbs = getBreadcrumbs(cleanedPath, routeTree);
  return {
    ...buildRouteMeta(cleanedPath, routeTree, {}),
    breadcrumbs: breadcrumbs.length > 0 ? breadcrumbs : [routeTree],
  };
}

// Performs a depth-first search to find the current route and its previous/next route
function buildRouteMeta(
  searchPath: string,
  currentRoute: RouteItem,
  ctx: RouteMeta
): RouteMeta {
  const { children } = currentRoute;

  if (ctx.route && !ctx.nextRoute) {
    ctx.nextRoute = currentRoute;
  }

  if (currentRoute.path === searchPath) {
    ctx.route = currentRoute;
  }

  if (!ctx.route) {
    ctx.prevRoute = currentRoute;
  }

  if (!children) {
    return ctx;
  }

  for (const route of children) {
    buildRouteMeta(searchPath, route, ctx);
  }

  return ctx;
}

// iterates the route tree from the current route to find its ancestors for breadcrumbs
function getBreadcrumbs(
  path: string,
  currentRoute: RouteItem,
  breadcrumbs: RouteItem[] = []
): RouteItem[] {
  if (currentRoute.path === path) {
    return [...breadcrumbs, currentRoute];
  }

  if (!currentRoute.children) {
    return [];
  }

  for (const route of currentRoute.children) {
    const childRoute = getBreadcrumbs(path, route, [
      ...breadcrumbs,
      currentRoute,
    ]);
    if (childRoute?.length) {
      return childRoute;
    }
  }

  return [];
}

export const handlerTokData = (res: any) => {
  const d1 = res.map((item: any) => {
    return {
      key: item.key,
      value: Number(item.totalCount),
      name: '执行总次数',
    };
  });
  const d2 = res.map((item: any) => {
    return {
      key: item.key,
      value: Number(item.successCount),
      name: '执行成功次数',
    };
  });

  return d1.concat(d2);
};

export const handlerChartData = (res: any) => {
  const d1 = res.map((item: any) => {
    return {
      date: item.date,
      value: Number(item.totalCount),
      name: '执行总次数',
    };
  });
  const d2 = res.map((item: any) => {
    return {
      date: item.date,
      value: Number(item.successCount),
      name: '执行成功次数',
    };
  });

  return d1.concat(d2);
};

export const getTopCount = (timeType: API.TimeType) => {
  switch (timeType) {
    case 'today':
      return 1;
    case 'week':
      return 7;
    case 'month':
      return 30;
    default:
      return 30;
  }
};
