export type PanelId =
  | 'dashboard'
  | 'kanban'
  | 'mytasks'
  | 'inbox'
  | 'calendar'
  | 'reports'
  | 'members'
  | 'settings';

export interface RouteHandle {
  crumb: string;
  title: string;
}
