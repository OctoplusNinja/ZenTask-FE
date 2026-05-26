import { useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { useNavigate } from 'react-router';
import { TASKS, COLUMNS, PEOPLE } from '../data/data';
import type { Task, ColId } from '../data/data';
import { Icon } from '../components/ui/Icon';
import { Button } from '../components/ui/Button';
import { Avatar, AvatarStack } from '../components/ui/Avatar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PriorityIcon } from '../components/ui/Tag';

export default function Dashboard() {
  const navigate = useNavigate();
  const onJumpToKanban = () => navigate('/board');
  const onOpenTask = (_id: string) => navigate('/board');
  const onNewTask = () => {};

  const allTasks = TASKS.q2;
  const today = allTasks.filter(t => t.due === 'Today' || t.due === 'May 22');
  const myTasks = allTasks.filter(t => t.assignees.includes('jl'));
  const doneCount = allTasks.filter(t => t.col === 'done').length;
  const inProgress = allTasks.filter(t => t.col === 'in_progress').length;
  const review = allTasks.filter(t => t.col === 'in_review').length;
  const total = allTasks.length;
  const completion = Math.round((doneCount / total) * 100);

  return (
    <div style={{
      flex: 1,
      overflow: 'auto',
      background: 'var(--bg)',
      padding: '20px 28px 40px',
    }}>
      <DashHeader onNewTask={onNewTask} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 18 }}>
        <StatCard label="Tasks due this week" value={today.length + 4} delta={{ dir: 'up', text: '2 added today' }}           accent="accent"  icon="calendar" />
        <StatCard label="In progress"          value={inProgress}      delta={{ dir: 'flat', text: 'across 3 boards' }}       accent="info"    icon="zap" />
        <StatCard label="Awaiting review"      value={review}          delta={{ dir: 'up', text: '+1 since yesterday' }}      accent="warning" icon="checkcir" />
        <StatCard label="Completed this quarter" value={doneCount + 38} delta={{ dir: 'up', text: `${completion}% of board done` }} accent="success" icon="trending" />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1.25fr) minmax(0, 0.9fr)',
        gap: 16,
        marginTop: 16,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <QuickAdd />
          <TodayTasks tasks={today} onOpenTask={onOpenTask} />
          <FocusBlock />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <BoardSnapshot allTasks={allTasks} onJumpToKanban={onJumpToKanban} />
          <MyTasksBlock myTasks={myTasks} onOpenTask={onOpenTask} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <UpcomingDeadlines tasks={allTasks} onOpenTask={onOpenTask} />
          <Activity />
          <TeamWorkload />
        </div>
      </div>
    </div>
  );
}

// ---- Header ----------------------------------------------------------------

function DashHeader({ onNewTask }: { onNewTask: () => void }) {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
      <div>
        <div style={{ fontSize: 12, color: 'var(--fg-subtle)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
          {greeting}, June.
        </h1>
        <div style={{ marginTop: 6, color: 'var(--fg-muted)', fontSize: 14, letterSpacing: '-0.005em' }}>
          You have <strong style={{ color: 'var(--fg)' }}>4 tasks</strong> on deck and <strong style={{ color: 'var(--danger)', fontWeight: 700 }}>1 overdue</strong>.
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <Button variant="secondary" size="md" icon="filter">This week</Button>
        <Button variant="primary" size="md" icon="plus" onClick={onNewTask}>New task</Button>
      </div>
    </div>
  );
}

// ---- Stat card -------------------------------------------------------------

type AccentKey = 'accent' | 'info' | 'warning' | 'success';

const STAT_COLORS: Record<AccentKey, { soft: string; fg: string }> = {
  accent:  { soft: 'var(--accent-soft)',  fg: 'var(--accent-soft-fg)' },
  info:    { soft: 'var(--info-soft)',    fg: 'oklch(38% 0.10 240)' },
  warning: { soft: 'var(--warning-soft)', fg: 'oklch(40% 0.10 75)' },
  success: { soft: 'var(--success-soft)', fg: 'var(--sage-800)' },
};

function StatCard({ label, value, delta, accent, icon }: {
  label: string;
  value: number;
  delta: { dir: 'up' | 'down' | 'flat'; text: string };
  accent: AccentKey;
  icon: string;
}) {
  const c = STAT_COLORS[accent];
  const dirColor = delta.dir === 'up' ? 'var(--success)' : delta.dir === 'down' ? 'var(--danger)' : 'var(--fg-subtle)';
  const dirIcon  = delta.dir === 'up' ? 'arrow_up' : delta.dir === 'down' ? 'arrow_dn' : 'arrow_rt';
  return (
    <div className="zt-card" style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '14px 16px',
      boxShadow: 'var(--shadow-xs)',
      transition: 'all 160ms var(--ease-out)',
      minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 600, letterSpacing: '-0.005em' }}>{label}</span>
        <span style={{ width: 26, height: 26, borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: c.soft, color: c.fg }}>
          <Icon name={icon} size={14} />
        </span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, fontFeatureSettings: '"tnum"' }}>{value}</div>
      <div style={{ marginTop: 6, fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 4, color: dirColor }}>
        <Icon name={dirIcon} size={11} />
        <span style={{ color: 'var(--fg-muted)' }}>{delta.text}</span>
      </div>
    </div>
  );
}

// ---- Quick add -------------------------------------------------------------

function QuickAdd() {
  const [val, setVal] = useState('');
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 14, boxShadow: 'var(--shadow-xs)', padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="plus" size={15} />
        </span>
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder="Capture a task — press Enter to add"
          onKeyDown={e => { if (e.key === 'Enter' && val.trim()) setVal(''); }}
          style={{
            flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent',
            fontFamily: 'inherit', fontSize: 13.5, color: 'var(--fg)', letterSpacing: '-0.005em',
          }}
        />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-subtle)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 5px' }}>N</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
        <Chip icon="board"    label="Q2 Roadmap" />
        <Chip icon="user"     label="June Lee" />
        <Chip icon="flag"     label="Medium" />
        <Chip icon="calendar" label="Today" />
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: 'var(--fg-faint)' }}>Type / for commands</span>
      </div>
    </div>
  );
}

function Chip({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="zt-chip" style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px 3px 6px', borderRadius: 999,
      background: 'var(--bg-sunken)', border: '1px solid var(--border-subtle)',
      color: 'var(--fg-muted)', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 500,
      cursor: 'pointer', transition: 'all 120ms var(--ease-out)',
    }}>
      <Icon name={icon} size={11} />
      {label}
    </button>
  );
}

// ---- Today tasks -----------------------------------------------------------

function TodayTasks({ tasks, onOpenTask }: { tasks: Task[]; onOpenTask: (id: string) => void }) {
  return (
    <Panel title="Due today" count={tasks.length} action={<a className="zt-link" href="#" onClick={e => e.preventDefault()}>View all</a>}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {tasks.map((t, i) => (
          <TaskRow key={t.id} task={t} onOpen={onOpenTask} divider={i < tasks.length - 1} />
        ))}
        {tasks.length === 0 && <Empty label="Nothing due today. Nice." />}
      </div>
    </Panel>
  );
}

function TaskRow({ task, onOpen, divider }: { task: Task; onOpen: (id: string) => void; divider?: boolean }) {
  const [done, setDone] = useState(false);
  const status = COLUMNS.find(c => c.id === task.col);
  return (
    <div
      onClick={() => onOpen(task.id)}
      className="zt-row"
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 4px',
        borderBottom: divider ? '1px solid var(--border-subtle)' : '1px solid transparent',
        cursor: 'pointer', minWidth: 0,
        transition: 'background 120ms var(--ease-out)',
        borderRadius: 8,
      }}
    >
      <button
        onClick={e => { e.stopPropagation(); setDone(d => !d); }}
        aria-label="Toggle complete"
        style={{
          width: 18, height: 18, flexShrink: 0,
          borderRadius: 999, border: `1.5px solid ${done ? 'var(--accent)' : 'var(--border-strong)'}`,
          background: done ? 'var(--accent)' : 'transparent',
          color: 'var(--fg-on-accent)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0,
        }}
      >
        {done && <Icon name="check" size={11} strokeWidth={2.5} />}
      </button>
      <PriorityIcon level={task.priority} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 500, letterSpacing: '-0.005em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          textDecoration: done ? 'line-through' : 'none',
          color: done ? 'var(--fg-subtle)' : 'var(--fg)',
        }}>{task.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, fontSize: 11, color: 'var(--fg-subtle)' }}>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{task.id}</span>
          <span>·</span>
          <StatusBadge status={task.col} label={status?.name} />
        </div>
      </div>
      <AvatarStack people={task.assignees.map(k => ({ initials: PEOPLE[k]?.initials ?? k }))} size={20} max={2} />
    </div>
  );
}

// ---- Focus block -----------------------------------------------------------

function FocusBlock() {
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(120% 80% at 100% 0%, color-mix(in oklch, var(--accent) 14%, transparent), transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent)', color: 'var(--fg-on-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="zap" size={18} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 2 }}>Pick a focus for today</div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', lineHeight: 1.45 }}>
            Block out 90 minutes for the WebSocket fix — it's the only urgent item on your board.
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <Button variant="primary" size="sm">Start focus</Button>
            <Button variant="ghost"   size="sm">Snooze</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Board snapshot --------------------------------------------------------

function BoardSnapshot({ allTasks, onJumpToKanban }: { allTasks: Task[]; onJumpToKanban: () => void }) {
  const counts = COLUMNS.map(c => ({ ...c, n: allTasks.filter(t => t.col === c.id).length }));
  const total = counts.reduce((s, c) => s + c.n, 0);

  const colColor: Record<ColId, string> = {
    backlog:     'var(--neutral-300)',
    in_progress: 'var(--info)',
    in_review:   'var(--warning)',
    done:        'var(--success)',
  };
  const dotColor: Record<ColId, string> = {
    backlog:     'var(--neutral-400)',
    in_progress: 'var(--info)',
    in_review:   'var(--warning)',
    done:        'var(--success)',
  };

  return (
    <Panel
      title="Q2 Roadmap"
      subtitle="Product · 14 tasks"
      action={<Button variant="ghost" size="sm" iconRight="arrow_rt" onClick={onJumpToKanban}>Open board</Button>}
    >
      <div style={{ display: 'flex', height: 8, borderRadius: 999, overflow: 'hidden', margin: '4px 0 14px' }}>
        {counts.map(c => (
          <span key={c.id} style={{ width: `${(c.n / total) * 100}%`, background: colColor[c.id] }} title={`${c.name}: ${c.n}`} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {counts.map(c => {
          const colTasks = allTasks.filter(t => t.col === c.id).slice(0, 3);
          return (
            <div key={c.id} style={{ background: 'var(--bg-sunken)', borderRadius: 10, padding: 8, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 4px' }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: dotColor[c.id] }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '-0.005em' }}>{c.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-subtle)', marginLeft: 'auto' }}>{c.n}</span>
              </div>
              {colTasks.map(t => (
                <div key={t.id} style={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 7, padding: '6px 8px',
                  fontSize: 11, lineHeight: 1.3, letterSpacing: '-0.005em', display: 'flex', flexDirection: 'column', gap: 4, minHeight: 44,
                }}>
                  <span style={{ fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as CSSProperties}>{t.title}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-subtle)' }}>{t.id}</span>
                </div>
              ))}
              {colTasks.length === 0 && <div style={{ fontSize: 10.5, color: 'var(--fg-faint)', padding: '8px 4px', textAlign: 'center' }}>—</div>}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

// ---- My tasks --------------------------------------------------------------

function MyTasksBlock({ myTasks, onOpenTask }: { myTasks: Task[]; onOpenTask: (id: string) => void }) {
  return (
    <Panel title="Assigned to me" count={myTasks.length} action={<a className="zt-link" href="#" onClick={e => e.preventDefault()}>My tasks →</a>}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {myTasks.slice(0, 4).map((t, i) => (
          <TaskRow key={t.id} task={t} onOpen={onOpenTask} divider={i < Math.min(myTasks.length, 4) - 1} />
        ))}
      </div>
    </Panel>
  );
}

// ---- Upcoming deadlines ----------------------------------------------------

function UpcomingDeadlines({ tasks, onOpenTask }: { tasks: Task[]; onOpenTask: (id: string) => void }) {
  const upcoming = tasks.filter(t => t.due && t.col !== 'done').slice(0, 5);
  return (
    <Panel title="Upcoming" count={upcoming.length}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
        {upcoming.map(t => (
          <div key={t.id} onClick={() => onOpenTask(t.id)} className="zt-row" style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            padding: '4px 2px', cursor: 'pointer', minWidth: 0,
            transition: 'background 120ms var(--ease-out)', borderRadius: 8,
          }}>
            <DueChip due={t.due!} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 500, letterSpacing: '-0.005em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{t.id}</div>
            </div>
            <Avatar initials={PEOPLE[t.assignees[0]]?.initials ?? '?'} size={20} />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function DueChip({ due }: { due: string }) {
  const overdue = due === 'Today' || due === 'Yesterday';
  const [day, month] = (() => {
    if (due === 'Today')     return ['22', 'May'];
    if (due === 'Yesterday') return ['21', 'May'];
    const parts = due.split(' ');
    return [parts[1] ?? '?', parts[0] ?? '?'];
  })();
  return (
    <div style={{
      width: 38, flexShrink: 0, textAlign: 'center',
      borderRadius: 8, padding: '4px 0 5px',
      background: overdue ? 'var(--danger-soft)' : 'var(--bg-sunken)',
      color: overdue ? 'oklch(38% 0.13 22)' : 'var(--fg-muted)',
      border: '1px solid var(--border-subtle)', lineHeight: 1,
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{month}</div>
      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, letterSpacing: '-0.02em' }}>{day}</div>
    </div>
  );
}

// ---- Activity feed ---------------------------------------------------------

const ACTIVITY_ITEMS = [
  { who: 'rt', verb: 'moved',     what: 'Pricing page Q2 refresh', to: 'In review', when: '12m ago' },
  { who: 'mk', verb: 'commented', what: 'WebSocket disconnects',   when: '34m ago', text: 'Reproduced on Safari only.' },
  { who: 'jl', verb: 'completed', what: 'Set up Sentry on prod',   when: '1h ago' },
  { who: 'ap', verb: 'created',   what: 'Server-side filters',     when: '2h ago' },
  { who: 'ev', verb: 'assigned',  what: 'Toast library',           to: 'Eli Vance', when: '3h ago' },
] as const;

function Activity() {
  return (
    <Panel title="Activity">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 2 }}>
        {ACTIVITY_ITEMS.map((a, i) => {
          const p = PEOPLE[a.who];
          if (!p) return null;
          return (
            <div key={i} style={{ display: 'flex', gap: 10, minWidth: 0 }}>
              <Avatar initials={p.initials} size={22} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--fg)', letterSpacing: '-0.005em' }}>
                  <strong style={{ fontWeight: 600 }}>{p.name}</strong>{' '}
                  <span style={{ color: 'var(--fg-muted)' }}>{a.verb}</span>{' '}
                  <span style={{ fontWeight: 500 }}>{a.what}</span>
                  {'to' in a && a.to && <span style={{ color: 'var(--fg-muted)' }}> → <span style={{ color: 'var(--fg)', fontWeight: 500 }}>{a.to}</span></span>}
                </div>
                {'text' in a && a.text && (
                  <div style={{ marginTop: 4, padding: '6px 8px', background: 'var(--bg-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 8, fontSize: 12, color: 'var(--fg-muted)', letterSpacing: '-0.005em' }}>
                    {a.text}
                  </div>
                )}
                <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 3 }}>{a.when}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

// ---- Team workload ---------------------------------------------------------

function TeamWorkload() {
  const allTasks = TASKS.q2;
  const team = Object.entries(PEOPLE).map(([k, p]) => {
    const n = allTasks.filter(t => t.assignees.includes(k) && t.col !== 'done').length;
    return { ...p, key: k, n };
  }).sort((a, b) => b.n - a.n).slice(0, 5);
  const max = Math.max(...team.map(t => t.n), 1);

  return (
    <Panel title="Team load">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
        {team.map(p => (
          <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar initials={p.initials} size={22} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
              <div style={{ height: 4, background: 'var(--bg-sunken)', borderRadius: 999, marginTop: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${(p.n / max) * 100}%`, height: '100%',
                  background: p.n / max >= 0.85 ? 'var(--warning)' : 'var(--accent)',
                  borderRadius: 999,
                  transition: 'width 360ms var(--ease-out)',
                }} />
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', minWidth: 18, textAlign: 'right' }}>{p.n}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ---- Panel shell -----------------------------------------------------------

function Panel({ title, subtitle, count, action, children }: {
  title: string;
  subtitle?: string;
  count?: number;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      boxShadow: 'var(--shadow-xs)',
      padding: 16,
      minWidth: 0,
    }}>
      <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, letterSpacing: '-0.015em' }}>{title}</h3>
            {count != null && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-subtle)' }}>{count}</span>}
          </div>
          {subtitle && <div style={{ fontSize: 11.5, color: 'var(--fg-subtle)', marginTop: 2 }}>{subtitle}</div>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function Empty({ label }: { label: string }) {
  return <div style={{ padding: '14px 6px', textAlign: 'center', color: 'var(--fg-subtle)', fontSize: 12 }}>{label}</div>;
}
