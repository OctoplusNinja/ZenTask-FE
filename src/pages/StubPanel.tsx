import type { PanelId } from '../types';

const LABELS: Partial<Record<PanelId, string>> = {
  kanban: 'Kanban Board',
  mytasks: 'My Tasks',
  inbox: 'Inbox',
  calendar: 'Calendar',
  reports: 'Reports',
  members: 'Members',
  settings: 'Settings',
};

export default function StubPanel({ panel }: { panel: PanelId }) {
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', color: 'var(--fg-subtle)', fontSize: 14,
    }}>
      {LABELS[panel] ?? panel} — coming soon
    </div>
  );
}
