import { Icon } from '../ui/Icon';
import { Avatar } from '../ui/Avatar';
import { IconButton } from '../ui/Button';
import { BOARDS, SPACES } from '../../data/data';
import type { PanelId } from '../../types';
import { PANELS } from '../../config/navigation';

interface SidebarProps {
  panel: PanelId;
  onPanel: (p: PanelId) => void;
  activeBoardId: string;
  onSelectBoard: (id: string) => void;
  collapsed: boolean;
}

export default function Sidebar({ panel, onPanel, activeBoardId, onSelectBoard, collapsed }: SidebarProps) {
  return (
    <aside style={{
      width: collapsed ? 56 : 244,
      flexShrink: 0,
      background: 'var(--bg)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 200ms var(--ease-out)',
      overflow: 'hidden',
    }}>
      {/* Brand */}
      <div style={{ padding: '14px 16px 8px', display: 'flex', alignItems: 'center', gap: 10, height: 52 }}>
        <span style={{ color: 'var(--accent)', display: 'inline-flex', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="8" width="48" height="13" rx="6.5" fill="currentColor"/>
            <rect x="2" y="25.5" width="60" height="13" rx="6.5" fill="currentColor" transform="rotate(-40 32 32)"/>
            <rect x="8" y="43" width="48" height="13" rx="6.5" fill="currentColor"/>
          </svg>
        </span>
        {!collapsed && <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>ZenTask</span>}
      </div>

      {/* Workspace switcher */}
      {!collapsed && (
        <div style={{ padding: '4px 8px 8px' }}>
          <button style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--bg-elevated)', cursor: 'pointer', textAlign: 'left',
            color: 'var(--fg)', fontFamily: 'inherit',
          }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--sage-200)', color: 'var(--sage-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>A</span>
            <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600 }}>Acme Co.</span>
            <Icon name="chevdown" size={14} style={{ color: 'var(--fg-subtle)' }} />
          </button>
        </div>
      )}

      {/* Primary nav */}
      <nav style={{ padding: '4px 8px' }}>
        {PANELS.map(p => (
          <NavItem
            key={p.id}
            icon={p.icon}
            label={p.label}
            badge={p.badge}
            active={panel === p.id}
            onClick={() => onPanel(p.id)}
            collapsed={collapsed}
          />
        ))}
        <NavItem icon="search" label="Search" kbd="⌘K" collapsed={collapsed} />
      </nav>

      {/* Contextual group */}
      <div style={{ padding: '10px 8px 0', flex: 1, overflowX: 'hidden', overflowY: 'auto' }}>
        {!collapsed && panel === 'kanban' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 10px 6px' }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>Boards</span>
              <IconButton icon="plus" label="New board" />
            </div>
            {SPACES.map(sp => {
              const boards = BOARDS.filter(b => b.spaceId === sp.id);
              if (!boards.length) return null;
              return (
                <div key={sp.id} style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', fontSize: 11.5, fontWeight: 600, color: 'var(--fg-muted)' }}>
                    <Icon name="chevdown" size={12} />
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: sp.color }} />
                    <span>{sp.name}</span>
                  </div>
                  {boards.map(b => (
                    <NavItem
                      key={b.id}
                      icon={b.icon}
                      label={b.name}
                      active={b.id === activeBoardId}
                      onClick={() => onSelectBoard(b.id)}
                      indent
                      collapsed={collapsed}
                    />
                  ))}
                </div>
              );
            })}
          </>
        )}

        {!collapsed && panel !== 'kanban' && (
          <div style={{ padding: '14px 12px 0' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBottom: 8 }}>Pinned</div>
            {BOARDS.slice(0, 2).map(b => (
              <NavItem
                key={b.id}
                icon="bookmark"
                label={b.name}
                onClick={() => { onPanel('kanban'); onSelectBoard(b.id); }}
                collapsed={collapsed}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '4px 8px 12px', borderTop: '1px solid var(--border-subtle)' }}>
        <NavItem icon="users"    label="Members"  active={panel === 'members'}  onClick={() => onPanel('members')}  collapsed={collapsed} />
        <NavItem icon="settings" label="Settings" active={panel === 'settings'} onClick={() => onPanel('settings')} collapsed={collapsed} />
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px 2px', marginTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
            <Avatar initials="JL" size={28} presence="on" />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>June Lee</div>
              <div style={{ fontSize: 11, color: 'var(--fg-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>june@acme.co</div>
            </div>
            <IconButton icon="more" label="Account menu" />
          </div>
        )}
      </div>
    </aside>
  );
}

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
  badge?: number;
  kbd?: string;
  onClick?: () => void;
  indent?: boolean;
  collapsed?: boolean;
}

function NavItem({ icon, label, active, badge, kbd, onClick, indent, collapsed }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', padding: collapsed ? '8px' : `7px 10px 7px ${indent ? 22 : 10}px`,
        borderRadius: 8, border: 0, cursor: 'pointer',
        background: active ? 'var(--bg-active)' : 'transparent',
        color: active ? 'var(--fg)' : 'var(--fg-muted)',
        fontFamily: 'inherit', fontSize: 13, fontWeight: active ? 600 : 500,
        textAlign: 'left',
        transition: 'background 120ms var(--ease-out)',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}
    >
      <Icon name={icon} size={16} style={{ color: active ? 'var(--accent)' : 'inherit' }} />
      {!collapsed && <span style={{ flex: 1, letterSpacing: '-0.005em' }}>{label}</span>}
      {!collapsed && kbd && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-subtle)' }}>{kbd}</span>}
      {!collapsed && badge != null && (
        <span style={{
          minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999,
          background: active ? 'var(--accent)' : 'var(--accent-soft)',
          color: active ? 'var(--fg-on-accent)' : 'var(--accent-soft-fg)',
          fontSize: 10.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>{badge}</span>
      )}
    </button>
  );
}
