import { useMatches } from 'react-router';
import type { RouteHandle } from '../types';

export default function StubPanel() {
  const matches = useMatches();
  const handle = matches.at(-1)?.handle as RouteHandle | undefined;

  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', color: 'var(--fg-subtle)', fontSize: 14,
    }}>
      {handle?.title ?? 'This page'} — coming soon
    </div>
  );
}
