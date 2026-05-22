export type ColId = 'backlog' | 'in_progress' | 'in_review' | 'done';
export type Priority = 1 | 2 | 3 | 4;
export type LinkKind = 'blocks' | 'blocked_by' | 'related' | 'duplicates';

export interface Task {
  id: string;
  col: ColId;
  title: string;
  tags: string[];
  priority: Priority;
  due: string | null;
  assignees: string[];
  comments: number;
  children?: string[];
  links?: { kind: LinkKind; id: string }[];
}

export interface Subtask {
  id: string;
  parent: string;
  title: string;
  done: boolean;
  assignee: string;
}

export interface Person {
  initials: string;
  name: string;
}

export interface Space {
  id: string;
  name: string;
  color: string;
}

export interface Board {
  id: string;
  spaceId: string;
  name: string;
  icon: string;
}

export interface Column {
  id: ColId;
  name: string;
  status: ColId;
}

export interface LinkKindDef {
  label: string;
  arrow: string;
  color: string;
}

export const PEOPLE: Record<string, Person> = {
  jl: { initials: 'JL', name: 'June Lee' },
  mk: { initials: 'MK', name: 'Marcus Kim' },
  rt: { initials: 'RT', name: 'Rina Tan' },
  ap: { initials: 'AP', name: 'Ada Patel' },
  ev: { initials: 'EV', name: 'Eli Vance' },
  zh: { initials: 'ZH', name: 'Zara Hassan' },
};

export const SPACES: Space[] = [
  { id: 'product',     name: 'Product',     color: 'var(--sage-500)' },
  { id: 'design',      name: 'Design',      color: 'oklch(58% 0.11 30)' },
  { id: 'engineering', name: 'Engineering', color: 'oklch(58% 0.10 250)' },
];

export const BOARDS: Board[] = [
  { id: 'q2',        spaceId: 'product',     name: 'Q2 Roadmap',       icon: 'board' },
  { id: 'design-sys', spaceId: 'design',     name: 'Design System v2', icon: 'board' },
  { id: 'infra',     spaceId: 'engineering', name: 'Platform & Infra', icon: 'board' },
  { id: 'launch',    spaceId: 'product',     name: 'Launch checklist', icon: 'board' },
];

export const COLUMNS: Column[] = [
  { id: 'backlog',     name: 'Backlog',     status: 'backlog' },
  { id: 'in_progress', name: 'In progress', status: 'in_progress' },
  { id: 'in_review',   name: 'In review',   status: 'in_review' },
  { id: 'done',        name: 'Done',        status: 'done' },
];

export const LINK_KINDS: Record<LinkKind, LinkKindDef> = {
  blocks:     { label: 'Blocks',     arrow: '→', color: 'var(--danger)' },
  blocked_by: { label: 'Blocked by', arrow: '←', color: 'var(--warning)' },
  related:    { label: 'Related to', arrow: '↔', color: 'var(--info)' },
  duplicates: { label: 'Duplicates', arrow: '≡', color: 'var(--fg-muted)' },
};

export const SUBTASKS: Record<string, Subtask> = {
  'ZT-1142a': { id: 'ZT-1142a', parent: 'ZT-1142', title: 'Spike: choose between Auth0 and WorkOS',  done: true,  assignee: 'jl' },
  'ZT-1142b': { id: 'ZT-1142b', parent: 'ZT-1142', title: 'Migrate session middleware to JWT',       done: true,  assignee: 'jl' },
  'ZT-1142c': { id: 'ZT-1142c', parent: 'ZT-1142', title: 'Add Google + Okta to the login screen',   done: false, assignee: 'rt' },
};

export const TASKS: Record<string, Task[]> = {
  q2: [
    { id: 'ZT-1140', col: 'backlog',     title: 'Refactor auth middleware to support SSO providers', tags: ['infra'], priority: 2, due: 'May 28', assignees: ['ap'], comments: 1 },
    { id: 'ZT-1141', col: 'backlog',     title: 'Audit empty-state copy across the app', tags: ['design', 'docs'], priority: 1, due: 'Jun 03', assignees: ['rt'], comments: 0 },
    { id: 'ZT-1147', col: 'backlog',     title: 'Spike: real-time presence on cards', tags: ['research'], priority: 2, due: null, assignees: ['mk'], comments: 3 },
    { id: 'ZT-1150', col: 'backlog',     title: 'Replace toast library with first-party component', tags: ['infra'], priority: 1, due: null, assignees: ['ev'], comments: 0 },

    { id: 'ZT-1142', col: 'in_progress', title: 'Move login flow to OAuth provider', tags: ['growth'], priority: 3, due: 'May 22', assignees: ['jl'], comments: 2,
      children: ['ZT-1142a', 'ZT-1142b', 'ZT-1142c'],
      links: [{ kind: 'blocks', id: 'ZT-1158' }, { kind: 'related', id: 'ZT-1140' }] },
    { id: 'ZT-1156', col: 'in_progress', title: 'Investigate WebSocket disconnects on /board page', tags: ['bug', 'infra'], priority: 4, due: 'Today', assignees: ['mk', 'rt'], comments: 7,
      links: [{ kind: 'blocked_by', id: 'ZT-1150' }] },
    { id: 'ZT-1158', col: 'in_progress', title: 'Onboarding: 3-step setup for new workspaces', tags: ['design', 'growth'], priority: 3, due: 'May 25', assignees: ['rt', 'jl'], comments: 4 },
    { id: 'ZT-1160', col: 'in_progress', title: 'Server-side filters for board view', tags: ['infra'], priority: 2, due: null, assignees: ['ap'], comments: 1 },

    { id: 'ZT-1132', col: 'in_review',   title: 'Pricing page Q2 refresh', tags: ['design'], priority: 2, due: 'May 19', assignees: ['rt'], comments: 5 },
    { id: 'ZT-1137', col: 'in_review',   title: 'Keyboard shortcuts for column nav', tags: ['design'], priority: 1, due: null, assignees: ['ev'], comments: 2 },
    { id: 'ZT-1138', col: 'in_review',   title: 'Improve drag-snap easing curve', tags: ['design'], priority: 1, due: null, assignees: ['jl', 'rt'], comments: 1 },

    { id: 'ZT-1101', col: 'done',        title: 'Set up Sentry on production', tags: ['infra'], priority: 2, due: null, assignees: ['ap'], comments: 0 },
    { id: 'ZT-1115', col: 'done',        title: 'Sage palette: split into 10 steps, validate AA', tags: ['design'], priority: 2, due: null, assignees: ['rt'], comments: 3 },
    { id: 'ZT-1125', col: 'done',        title: 'Rate-limit board reads per workspace', tags: ['infra'], priority: 3, due: null, assignees: ['mk'], comments: 1 },
  ],
};
