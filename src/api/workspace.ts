export interface Workspace {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  avatarFg: string;
}

const MOCK_WORKSPACE: Workspace = {
  id: 'acme',
  name: 'Acme Co.',
  initials: 'A',
  avatarBg: 'var(--sage-200)',
  avatarFg: 'var(--sage-800)',
};

export async function getWorkspace(): Promise<Workspace> {
  return MOCK_WORKSPACE;
}
