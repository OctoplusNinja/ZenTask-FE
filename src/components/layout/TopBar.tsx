import { useMatches } from 'react-router';
import type { RouteHandle } from '../../types';
import { useUIStore } from '../../store/ui';
import { Icon } from '../ui/Icon';
import { IconButton } from '../ui/Button';
import { Avatar } from '../ui/Avatar';

export default function TopBar() {
  const matches = useMatches();
  const handle = matches.at(-1)?.handle as RouteHandle | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loaderData = (matches.at(-1) as any)?.data as { crumb?: string; title?: string } | undefined;
  const crumb = handle?.crumb ?? loaderData?.crumb ?? 'Workspace';
  const title = handle?.title ?? loaderData?.title ?? '';

  const { theme, toggleTheme, toggleSidebar } = useUIStore();

  return (
    <header style={{
      height: 52, flexShrink: 0,
      padding: '0 16px 0 12px',
      display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: '1px solid var(--border-subtle)',
      background: 'color-mix(in oklch, var(--bg-elevated) 88%, transparent)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <IconButton icon="menu" label="Toggle sidebar" onClick={toggleSidebar} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
        <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{crumb}</span>
        <Icon name="chevright" size={12} style={{ color: 'var(--fg-faint)' }} />
        <span style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</span>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-sunken)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: '5px 10px 5px 8px',
          color: 'var(--fg-muted)',
          fontFamily: 'inherit', fontSize: 12,
          cursor: 'pointer',
          minWidth: 220,
        }}>
          <Icon name="search" size={14} />
          <span style={{ flex: 1, textAlign: 'left' }}>Search or jump to…</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-subtle)' }}>⌘K</span>
        </button>
        <span style={{ width: 1, height: 20, background: 'var(--border-subtle)', margin: '0 2px' }} />
        <IconButton icon={theme === 'dark' ? 'sun' : 'moon'} label="Toggle theme" onClick={toggleTheme} />
        <IconButton icon="bell" label="Notifications" />
        <span style={{ marginLeft: 4 }}><Avatar initials="JL" size={28} presence="on" /></span>
      </div>
    </header>
  );
}
