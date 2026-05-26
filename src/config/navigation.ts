import type { PanelId } from '../types';

export interface NavPanel {
  id: PanelId;
  label: string;
  icon: string;
  path: string;
  matchPrefix?: string;
  badge?: number;
}

export const PANELS: NavPanel[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home',     path: '/dashboard' },
  { id: 'kanban',    label: 'Boards',    icon: 'board',    path: '/board', matchPrefix: '/board' },
  { id: 'mytasks',   label: 'My tasks',  icon: 'checkcir', path: '/my-tasks' },
  { id: 'inbox',     label: 'Inbox',     icon: 'inbox',    path: '/inbox', badge: 3 },
  { id: 'calendar',  label: 'Calendar',  icon: 'calendar', path: '/calendar' },
  { id: 'reports',   label: 'Reports',   icon: 'chart',    path: '/reports' },
];

export const FOOTER_PANELS: NavPanel[] = [
  { id: 'members',  label: 'Members',  icon: 'users',    path: '/members' },
  { id: 'settings', label: 'Settings', icon: 'settings', path: '/settings' },
];
