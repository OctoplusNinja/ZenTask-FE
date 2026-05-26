import { useNavigate, useLocation, useMatch } from 'react-router';
import { Icon } from '../ui/Icon';
import { Avatar } from '../ui/Avatar';
import { IconButton } from '../ui/Button';
import { BOARDS, SPACES } from '../../data/data';
import { PANELS, FOOTER_PANELS } from '../../config/navigation';
import type { NavPanel } from '../../config/navigation';
import { useUIStore } from '../../store/ui';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import logo from '../../assets/ZenTask Logo Transparent.png';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const boardMatch = useMatch('/board/:boardId');
  const { collapsed } = useUIStore();

  const isActive = (p: NavPanel) =>
    p.matchPrefix
      ? location.pathname.startsWith(p.matchPrefix)
      : location.pathname === p.path;

  return (
    <aside
      className="shrink-0 flex flex-col overflow-hidden"
      style={{
        width: collapsed ? 56 : 244,
        background: 'var(--bg)',
        borderRight: '1px solid var(--border-subtle)',
        transition: 'width 200ms var(--ease-out)',
      }}
    >
      {/* Brand */}
      <button
        onClick={() => navigate('/dashboard')}
        className={`flex items-center h-[52px] pt-[14px] pb-2 border-0 bg-transparent cursor-pointer [font-family:inherit] ${collapsed ? 'justify-center px-2 w-full' : 'gap-[10px] px-4'}`}
      >
        <img src={logo} alt="ZenTask" width={collapsed ? 28 : 32} height={collapsed ? 28 : 32} className="shrink-0" />
        {!collapsed && <span className="font-bold text-[15px] tracking-[-0.02em] whitespace-nowrap" style={{ color: 'var(--fg)' }}>ZenTask</span>}
      </button>

      {/* Workspace switcher */}
      {!collapsed && <WorkspaceSwitcher />}

      {/* Primary nav */}
      <nav className="py-1 px-2">
        {PANELS.map(p => (
          <NavItem
            key={p.id}
            icon={p.icon}
            label={p.label}
            badge={p.badge}
            active={isActive(p)}
            onClick={() => navigate(p.path)}
            collapsed={collapsed}
          />
        ))}
        <NavItem icon="search" label="Search" kbd="⌘K" collapsed={collapsed} />
      </nav>

      {/* Contextual group */}
      <div className="pt-[10px] px-2 pb-0 flex-1 overflow-x-hidden overflow-y-auto">
        {!collapsed && boardMatch && (
          <>
            <div className="flex items-center justify-between pt-1 px-[10px] pb-[6px]">
              <span
                className="text-[10.5px] font-bold tracking-[0.08em] uppercase"
                style={{ color: 'var(--fg-subtle)' }}
              >Boards</span>
              <IconButton icon="plus" label="New board" />
            </div>
            {SPACES.map(sp => {
              const boards = BOARDS.filter(b => b.spaceId === sp.id);
              if (!boards.length) return null;
              return (
                <div key={sp.id} className="mb-[6px]">
                  <div
                    className="flex items-center gap-2 py-1 px-[10px] text-[11.5px] font-semibold"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    <Icon name="chevdown" size={12} />
                    <span className="w-[6px] h-[6px] rounded-full" style={{ background: sp.color }} />
                    <span>{sp.name}</span>
                  </div>
                  {boards.map(b => (
                    <NavItem
                      key={b.id}
                      icon={b.icon}
                      label={b.name}
                      active={b.id === boardMatch.params.boardId}
                      onClick={() => navigate(`/board/${b.id}`)}
                      indent
                      collapsed={collapsed}
                    />
                  ))}
                </div>
              );
            })}
          </>
        )}

        {!collapsed && !boardMatch && (
          <div className="pt-[14px] px-3 pb-0">
            <div
              className="text-[10.5px] font-bold tracking-[0.08em] uppercase mb-2"
              style={{ color: 'var(--fg-subtle)' }}
            >Pinned</div>
            {BOARDS.slice(0, 2).map(b => (
              <NavItem
                key={b.id}
                icon="bookmark"
                label={b.name}
                onClick={() => navigate(`/board/${b.id}`)}
                collapsed={collapsed}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-1 px-2 pb-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        {FOOTER_PANELS.map(p => (
          <NavItem
            key={p.id}
            icon={p.icon}
            label={p.label}
            active={location.pathname === p.path}
            onClick={() => navigate(p.path)}
            collapsed={collapsed}
          />
        ))}
        {!collapsed && (
          <div
            className="flex items-center gap-[10px] pt-[10px] px-[10px] pb-[2px] mt-[6px]"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <Avatar initials="JL" size={28} presence="on" />
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-semibold truncate">June Lee</div>
              <div className="text-[11px] truncate" style={{ color: 'var(--fg-subtle)' }}>june@acme.co</div>
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
      className={`flex items-center gap-[10px] w-full rounded-[8px] border-0 cursor-pointer [font-family:inherit] text-[13px] text-left ${active ? 'font-semibold' : 'font-medium'} ${collapsed ? 'p-2 justify-center' : `pt-[7px] pr-[10px] pb-[7px] ${indent ? 'pl-[22px]' : 'pl-[10px]'} justify-start`}`}
      style={{
        background: active ? 'var(--bg-active)' : 'transparent',
        color: active ? 'var(--fg)' : 'var(--fg-muted)',
        transition: 'background 120ms var(--ease-out)',
      }}
    >
      <Icon name={icon} size={16} style={{ color: active ? 'var(--accent)' : 'inherit' }} />
      {!collapsed && <span className="flex-1 tracking-[-0.005em]">{label}</span>}
      {!collapsed && kbd && (
        <span className="text-[10.5px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)' }}>{kbd}</span>
      )}
      {!collapsed && badge != null && (
        <span
          className="min-w-[18px] h-[18px] px-[5px] rounded-full text-[10.5px] font-bold inline-flex items-center justify-center"
          style={{
            background: active ? 'var(--accent)' : 'var(--accent-soft)',
            color: active ? 'var(--fg-on-accent)' : 'var(--accent-soft-fg)',
          }}
        >{badge}</span>
      )}
    </button>
  );
}
