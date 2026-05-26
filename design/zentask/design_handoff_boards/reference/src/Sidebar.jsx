// Panel-driven sidebar. The top "Workspace" nav switches between top-level views
// (dashboard / kanban / etc). The "Boards" group below appears only when the
// Kanban panel is active and lets you switch which board you're looking at.

const WORKSPACES = [
  { id: 'acme',    name: 'Acme Co.',         plan: 'Business', members: 24, initial: 'A', tint: 'sage' },
  { id: 'studio',  name: 'Northwind Studio', plan: 'Starter',  members: 6,  initial: 'N', tint: 'amber' },
  { id: 'side',    name: 'Side projects',    plan: 'Free',     members: 1,  initial: 'S', tint: 'slate' },
];

const WS_TINTS = {
  sage:  { bg: 'var(--sage-200)',          fg: 'var(--sage-800)' },
  amber: { bg: 'oklch(92% 0.06 75)',       fg: 'oklch(38% 0.10 75)' },
  slate: { bg: 'oklch(92% 0.012 250)',     fg: 'oklch(38% 0.04 250)' },
};

const PANELS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'kanban',    label: 'Boards',    icon: 'board' },
  { id: 'mytasks',   label: 'My tasks',  icon: 'checkcir' },
  { id: 'inbox',     label: 'Inbox',     icon: 'inbox', badge: 3 },
  { id: 'calendar',  label: 'Calendar',  icon: 'calendar' },
  { id: 'reports',   label: 'Reports',   icon: 'chart' },
];

function Sidebar({ panel, onPanel, activeBoardId, onSelectBoard, collapsed }) {
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
      <div style={{ padding: '14px 16px 8px', display: 'flex', alignItems: 'center', gap: 10, height: 52, boxSizing: 'border-box' }}>
        <span style={{ color: 'var(--accent)', display: 'inline-flex' }}>
          <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="8" width="48" height="13" rx="6.5" fill="currentColor"/>
            <rect x="2" y="25.5" width="60" height="13" rx="6.5" fill="currentColor" transform="rotate(-40 32 32)"/>
            <rect x="8" y="43" width="48" height="13" rx="6.5" fill="currentColor"/>
          </svg>
        </span>
        {!collapsed && <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>ZenTask</span>}
      </div>

      {/* Workspace switcher */}
      {!collapsed && <WorkspaceSwitcher onPanel={onPanel} />}

      {/* Primary nav (panel switcher) */}
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

      {/* Boards group (only shown when kanban is selected & expanded) */}
      <div style={{ padding: '10px 8px 0', flex: 1, overflow: 'hidden auto' }}>
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

      {/* Footer nav */}
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
            <IconButton icon="more" label="Account" />
          </div>
        )}
      </div>
    </aside>
  );
}

function WsAvatar({ initial, tint, size = 22, radius = 6 }) {
  const c = WS_TINTS[tint] || WS_TINTS.sage;
  return (
    <span style={{
      width: size, height: size, borderRadius: radius,
      background: c.bg, color: c.fg, flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * 0.5), fontWeight: 700, letterSpacing: '-0.01em',
    }}>{initial}</span>
  );
}

function WorkspaceSwitcher({ onPanel }) {
  const [open, setOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState('acme');
  const wrapRef = React.useRef(null);
  const active = WORKSPACES.find(w => w.id === activeId) || WORKSPACES[0];

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div ref={wrapRef} style={{ padding: '4px 8px 8px', position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="zt-ws"
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 10px', borderRadius: 8,
          border: '1px solid ' + (open ? 'var(--border-strong)' : 'var(--border)'),
          background: open ? 'var(--bg-hover)' : 'var(--bg-elevated)',
          cursor: 'pointer', textAlign: 'left', color: 'var(--fg)', fontFamily: 'inherit',
          transition: 'background 120ms var(--ease-out), border-color 120ms var(--ease-out)',
        }}
      >
        <WsAvatar initial={active.initial} tint={active.tint} />
        <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{active.name}</span>
        <Icon name="chevdown" size={14} style={{ color: 'var(--fg-subtle)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 160ms var(--ease-out)' }} />
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute', top: 'calc(100% - 2px)', left: 8, right: 8,
            zIndex: 50,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            padding: 6,
            animation: 'zt-fade 120ms var(--ease-out)',
            transformOrigin: 'top center',
          }}
        >
          <div style={{
            padding: '6px 10px 4px',
            fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--fg-subtle)',
          }}>Workspaces</div>

          {WORKSPACES.map(w => {
            const isActive = w.id === activeId;
            return (
              <button
                key={w.id}
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => { setActiveId(w.id); setOpen(false); }}
                className="zt-nav"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '8px 8px 8px 8px',
                  borderRadius: 8, border: 0, cursor: 'pointer',
                  background: 'transparent', color: 'var(--fg)',
                  fontFamily: 'inherit', textAlign: 'left',
                }}
              >
                <WsAvatar initial={w.initial} tint={w.tint} size={28} radius={7} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-subtle)', lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {w.plan} · {w.members} {w.members === 1 ? 'member' : 'members'}
                  </div>
                </span>
                {isActive
                  ? <Icon name="check" size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  : <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10,
                      color: 'var(--fg-subtle)', letterSpacing: '0.04em',
                      padding: '1px 5px', borderRadius: 4,
                      border: '1px solid var(--border)', background: 'var(--bg-sunken)',
                      flexShrink: 0,
                    }}>⌘{WORKSPACES.indexOf(w) + 1}</span>}
              </button>
            );
          })}

          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '6px 4px' }} />

          <WsMenuRow
            icon="plus"
            label="Create workspace"
            sub="Spin up a new space for another team or project."
            onClick={() => setOpen(false)}
          />
          <WsMenuRow
            icon="users"
            label="Invite teammates"
            onClick={() => setOpen(false)}
          />
          <WsMenuRow
            icon="settings"
            label="Workspace settings"
            onClick={() => { onPanel && onPanel('settings'); setOpen(false); }}
          />

          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '6px 4px' }} />

          <WsMenuRow
            icon="arrow_rt"
            label="Log out"
            muted
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

function WsMenuRow({ icon, label, sub, muted, onClick }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="zt-nav"
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%',
        padding: sub ? '8px 8px' : '7px 8px',
        borderRadius: 8, border: 0, cursor: 'pointer',
        background: 'transparent',
        color: muted ? 'var(--fg-muted)' : 'var(--fg)',
        fontFamily: 'inherit', textAlign: 'left',
      }}
    >
      <span style={{
        width: 28, height: sub ? 28 : 22, display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        color: muted ? 'var(--fg-subtle)' : 'var(--fg-muted)',
      }}>
        <Icon name={icon} size={16} />
      </span>
      <span style={{ flex: 1, minWidth: 0, paddingTop: sub ? 1 : 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.25 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--fg-subtle)', lineHeight: 1.4, marginTop: 2 }}>{sub}</div>}
      </span>
    </button>
  );
}

function NavItem({ icon, label, active, badge, kbd, onClick, indent, collapsed }) {
  return (
    <button onClick={onClick} className="zt-nav" style={{
      display: 'flex', alignItems: 'center', gap: 10,
      width: '100%', padding: collapsed ? '8px' : `7px 10px 7px ${indent ? 22 : 10}px`,
      borderRadius: 8, border: 0, cursor: 'pointer',
      background: active ? 'var(--bg-active)' : 'transparent',
      color: active ? 'var(--fg)' : 'var(--fg-muted)',
      fontFamily: 'inherit', fontSize: 13, fontWeight: active ? 600 : 500,
      textAlign: 'left',
      transition: 'background 120ms var(--ease-out)',
      justifyContent: collapsed ? 'center' : 'flex-start',
    }}>
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

Object.assign(window, { Sidebar, NavItem, WorkspaceSwitcher });
