import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Icon } from '../ui/Icon';
import { getWorkspaces } from '../../api/workspace';
import type { Workspace } from '../../api/workspace';

interface WsAvatarProps {
  initials: string;
  avatarBg: string;
  avatarFg: string;
  size?: number;
  radius?: number;
}

function WsAvatar({ initials, avatarBg, avatarFg, size = 22, radius = 6 }: WsAvatarProps) {
  return (
    <span
      className="inline-flex items-center justify-center shrink-0 font-bold tracking-[-0.01em]"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: avatarBg,
        color: avatarFg,
        fontSize: Math.round(size * 0.5),
      }}
    >
      {initials[0]}
    </span>
  );
}

interface WsMenuRowProps {
  icon: string;
  label: string;
  sub?: string;
  muted?: boolean;
  onClick: () => void;
}

function WsMenuRow({ icon, label, sub, muted, onClick }: WsMenuRowProps) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="zt-ws-row flex items-start gap-[10px] w-full rounded-[8px] border-0 cursor-pointer [font-family:inherit] text-left"
      style={{
        padding: sub ? '8px' : '7px 8px',
        color: muted ? 'var(--fg-muted)' : 'var(--fg)',
      }}
    >
      <span
        className="inline-flex items-center justify-center shrink-0"
        style={{
          width: 28,
          height: sub ? 28 : 22,
          color: muted ? 'var(--fg-subtle)' : 'var(--fg-muted)',
        }}
      >
        <Icon name={icon} size={16} />
      </span>
      <span className="flex-1 min-w-0" style={{ paddingTop: sub ? 1 : 0 }}>
        <div className="text-[12.5px] font-semibold leading-[1.25]">{label}</div>
        {sub && (
          <div className="text-[11px] leading-[1.4] mt-[2px]" style={{ color: 'var(--fg-subtle)' }}>
            {sub}
          </div>
        )}
      </span>
    </button>
  );
}

export function WorkspaceSwitcher() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState('acme');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getWorkspaces().then(setWorkspaces);
  }, []);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const active = workspaces.find(w => w.id === activeId) ?? workspaces[0];
  if (!active) return null;

  return (
    <div ref={wrapRef} className="relative pt-1 px-2 pb-2">
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-full flex items-center gap-2 rounded-[8px] cursor-pointer [font-family:inherit] text-left"
        style={{
          padding: '7px 10px',
          border: `1px solid ${open ? 'var(--border-strong)' : 'var(--border)'}`,
          background: open ? 'var(--bg-hover)' : 'var(--bg-elevated)',
          color: 'var(--fg)',
          transition: 'background 120ms var(--ease-out), border-color 120ms var(--ease-out)',
        }}
      >
        <WsAvatar initials={active.initials} avatarBg={active.avatarBg} avatarFg={active.avatarFg} />
        <span className="flex-1 text-[12.5px] font-semibold truncate">{active.name}</span>
        <Icon
          name="chevdown"
          size={14}
          style={{
            color: 'var(--fg-subtle)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 160ms var(--ease-out)',
          }}
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute z-50 p-[6px]"
          style={{
            top: 'calc(100% - 2px)',
            left: 8,
            right: 8,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            animation: 'ws-fade 120ms var(--ease-out)',
            transformOrigin: 'top center',
          }}
        >
          <div
            className="text-[10.5px] font-bold uppercase tracking-[0.08em]"
            style={{ padding: '6px 10px 4px', color: 'var(--fg-subtle)' }}
          >
            Workspaces
          </div>

          {workspaces.map((w, i) => {
            const isActive = w.id === activeId;
            return (
              <button
                key={w.id}
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => { setActiveId(w.id); setOpen(false); }}
                className="zt-ws-row flex items-center gap-[10px] w-full p-2 rounded-[8px] border-0 cursor-pointer [font-family:inherit] text-left"
                style={{ color: 'var(--fg)' }}
              >
                <WsAvatar initials={w.initials} avatarBg={w.avatarBg} avatarFg={w.avatarFg} size={28} radius={7} />
                <span className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-semibold leading-[1.25] truncate">{w.name}</div>
                  <div className="text-[11px] leading-[1.35] truncate" style={{ color: 'var(--fg-subtle)' }}>
                    {w.plan} · {w.members} {w.members === 1 ? 'member' : 'members'}
                  </div>
                </span>
                {isActive
                  ? <Icon name="check" size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  : (
                    <span
                      className="text-[10px] shrink-0 tracking-[0.04em]"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--fg-subtle)',
                        padding: '1px 5px',
                        borderRadius: 4,
                        border: '1px solid var(--border)',
                        background: 'var(--bg-sunken)',
                      }}
                    >
                      ⌘{i + 1}
                    </span>
                  )
                }
              </button>
            );
          })}

          <div className="h-px mx-1 my-[6px]" style={{ background: 'var(--border-subtle)' }} />

          <WsMenuRow
            icon="plus"
            label="Create workspace"
            sub="Spin up a new space for another team or project."
            onClick={() => setOpen(false)}
          />
          <WsMenuRow icon="users" label="Invite teammates" onClick={() => setOpen(false)} />
          <WsMenuRow
            icon="settings"
            label="Workspace settings"
            onClick={() => { navigate('/settings'); setOpen(false); }}
          />

          <div className="h-px mx-1 my-[6px]" style={{ background: 'var(--border-subtle)' }} />

          <WsMenuRow icon="arrow_rt" label="Log out" muted onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
