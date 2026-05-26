export interface Workspace {
  id: string;
  name: string;
  plan: 'Free' | 'Starter' | 'Business' | 'Enterprise';
  members: number;
  initials: string;
  avatarBg: string;
  avatarFg: string;
}

const MOCK_WORKSPACES: Workspace[] = [
  { id: 'acme',   name: 'Acme Co.',         plan: 'Business', members: 24, initials: 'A', avatarBg: 'var(--sage-200)',       avatarFg: 'var(--sage-800)' },
  { id: 'studio', name: 'Northwind Studio', plan: 'Starter',  members: 6,  initials: 'N', avatarBg: 'oklch(92% 0.06 75)',   avatarFg: 'oklch(38% 0.10 75)' },
  { id: 'side',   name: 'Side projects',    plan: 'Free',     members: 1,  initials: 'S', avatarBg: 'oklch(92% 0.012 250)', avatarFg: 'oklch(38% 0.04 250)' },
];

export async function getWorkspaces(): Promise<Workspace[]> {
  return MOCK_WORKSPACES;
}

export async function getWorkspace(): Promise<Workspace> {
  return MOCK_WORKSPACES[0];
}
