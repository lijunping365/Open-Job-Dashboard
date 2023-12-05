import { User } from '@/types/UserTyping';

export interface RouteItem {
  /** Id of menu item */
  id: number;
  /** Pid of menu item */
  pid: number;
  /** Page title (for the sidebar) */
  name: string;
  /** Optional page description for heading */
  description?: string;
  /** Icon for title */
  icon?: string;
  /** Path to page */
  path: string;
  /** Level of menu item */
  level: number;
  /** Type of menu item */
  type: number;
  /** Option of menu item */
  options: number;
  /** CreateUser of menu item */
  createUser: number;
  /** UpdateTime of menu item */
  updateTime: string;
  /** List of sub-routes */
  children?: RouteItem[];
}

/** Routing metadata about a given route and it's siblings and parent */
export interface RouteMeta {
  /** The previous route */
  prevRoute?: RouteItem;
  /** The next route */
  nextRoute?: RouteItem;
  /** The current route */
  route?: RouteItem;
  /** Trail of parent routes */
  breadcrumbs?: RouteItem[];
}
