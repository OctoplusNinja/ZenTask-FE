import type { PanelId } from '../types';

export interface NavPanel {
  id: PanelId;
  label: string;
  icon: string;
  badge?: number;
}

export interface Breadcrumb {
  crumb: string;
  title: string;
}

export const PANELS: NavPanel[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'kanban',    label: 'Boards',    icon: 'board' },
  { id: 'mytasks',   label: 'My tasks',  icon: 'checkcir' },
  { id: 'inbox',     label: 'Inbox',     icon: 'inbox', badge: 3 },
  { id: 'calendar',  label: 'Calendar',  icon: 'calendar' },
  { id: 'reports',   label: 'Reports',   icon: 'chart' },
];

export const BREADCRUMBS: Record<PanelId, Breadcrumb> = {
  dashboard: { crumb: 'Workspace', title: 'Dashboard' },
  kanban:    { crumb: 'Product',   title: 'Q2 Roadmap' },
  mytasks:   { crumb: 'Workspace', title: 'My tasks' },
  inbox:     { crumb: 'Workspace', title: 'Inbox' },
  calendar:  { crumb: 'Workspace', title: 'Calendar' },
  reports:   { crumb: 'Workspace', title: 'Reports' },
  members:   { crumb: 'Workspace', title: 'Members' },
  settings:  { crumb: 'Workspace', title: 'Settings' },
};
