// Top-level app shell. Owns: theme, active panel, active board, sidebar
// collapse, open task, and tasks (so we can move them between columns).

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "sage",
  "density": "balanced"
}/*EDITMODE-END*/;

const ACCENT_PALETTES = {
  sage:   { accent: 'oklch(58% 0.095 172)', hover: 'oklch(53% 0.10 172)', pressed: 'oklch(48% 0.10 172)', soft: 'oklch(94% 0.04 172)', softFg: 'oklch(38% 0.10 172)', onAccent: '#fff', focus: 'oklch(58% 0.095 172 / 0.30)' },
  indigo: { accent: 'oklch(56% 0.18 274)', hover: 'oklch(50% 0.19 274)', pressed: 'oklch(45% 0.19 274)', soft: 'oklch(95% 0.05 274)', softFg: 'oklch(38% 0.16 274)', onAccent: '#fff', focus: 'oklch(56% 0.18 274 / 0.30)' },
  coral:  { accent: 'oklch(64% 0.16 28)',  hover: 'oklch(58% 0.17 28)',  pressed: 'oklch(53% 0.17 28)',  soft: 'oklch(94% 0.05 28)',  softFg: 'oklch(40% 0.15 28)',  onAccent: '#fff', focus: 'oklch(64% 0.16 28 / 0.30)' },
  amber:  { accent: 'oklch(72% 0.15 70)',  hover: 'oklch(66% 0.16 70)',  pressed: 'oklch(60% 0.16 70)',  soft: 'oklch(95% 0.06 75)',  softFg: 'oklch(42% 0.13 75)',  onAccent: '#1a1408', focus: 'oklch(72% 0.15 70 / 0.30)' },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [panel, setPanel] = React.useState('dashboard');
  const [boardId, setBoardId] = React.useState('q2');
  const [collapsed, setCollapsed] = React.useState(false);
  const [openTaskId, setOpenTaskId] = React.useState(null);
  const [newTaskOpen, setNewTaskOpen] = React.useState(false);
  const [tasks, setTasks] = React.useState(() => (TASKS[boardId] || []).map(x => ({ ...x })));

  React.useEffect(() => {
    setTasks((TASKS[boardId] || []).map(x => ({ ...x })));
    setOpenTaskId(null);
  }, [boardId]);

  // Theme on root
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
  }, [t.theme]);

  // Accent overrides
  React.useEffect(() => {
    const p = ACCENT_PALETTES[t.accent] || ACCENT_PALETTES.sage;
    const r = document.documentElement.style;
    r.setProperty('--accent',         p.accent);
    r.setProperty('--accent-hover',   p.hover);
    r.setProperty('--accent-pressed', p.pressed);
    r.setProperty('--accent-soft',    p.soft);
    r.setProperty('--accent-soft-fg', p.softFg);
    r.setProperty('--fg-on-accent',   p.onAccent);
    r.setProperty('--btn-primary-bg', p.accent);
    r.setProperty('--btn-primary-bg-hover',  p.hover);
    r.setProperty('--btn-primary-bg-pressed', p.pressed);
    r.setProperty('--btn-primary-fg', p.onAccent);
    r.setProperty('--shadow-focus', `0 0 0 3px ${p.focus}`);
    r.setProperty('--border-focus', p.accent);
    r.setProperty('--selection-bg',  p.accent);
    r.setProperty('--selection-fg',  p.onAccent);
  }, [t.accent]);

  const board = BOARDS.find(b => b.id === boardId);
  const openTask = openTaskId ? tasks.find(x => x.id === openTaskId) : null;

  const moveTask = (id, toColId) => {
    setTasks(ts => ts.map(x => x.id === id ? { ...x, col: toColId } : x));
  };

  const updateTask = (updated) => {
    setTasks(ts => ts.map(x => x.id === updated.id ? updated : x));
  };

  const createTask = (newTask, newBoardId) => {
    // Reflect on whichever board it landed on. Persist to the in-memory
    // TASKS store so seed-data consumers (board snapshot, dashboard widgets)
    // see it on re-render.
    TASKS[newBoardId] = TASKS[newBoardId] || [];
    TASKS[newBoardId].unshift(newTask);
    if (newBoardId === boardId) {
      setTasks(ts => [newTask, ...ts]);
    }
    setBoardId(newBoardId);
    setPanel('kanban');
    setOpenTaskId(newTask.id);
  };

  const openNewTask = () => setNewTaskOpen(true);

  // Top-bar breadcrumb
  const topbarTitle = (() => {
    if (panel === 'dashboard') return { crumb: 'Workspace', title: 'Dashboard' };
    if (panel === 'kanban')    return { crumb: 'Product',   title: board?.name || 'Board' };
    const s = STUBS[panel];
    return s ? { crumb: 'Workspace', title: s.title } : { crumb: 'Workspace', title: '' };
  })();

  return (
    <div style={{
      display: 'flex',
      width: '100vw', height: '100vh',
      background: 'var(--bg)',
      color: 'var(--fg)',
      fontFamily: 'var(--font-sans)',
      overflow: 'hidden',
    }}>
      <Sidebar
        panel={panel}
        onPanel={setPanel}
        activeBoardId={boardId}
        onSelectBoard={(id) => { setPanel('kanban'); setBoardId(id); }}
        collapsed={collapsed}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        <TopBar
          crumb={topbarTitle.crumb}
          title={topbarTitle.title}
          theme={t.theme}
          onToggleTheme={() => setTweak('theme', t.theme === 'light' ? 'dark' : 'light')}
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => setCollapsed(c => !c)}
        />

        {panel === 'dashboard' && (
          <Dashboard
            onJumpToKanban={() => setPanel('kanban')}
            onOpenTask={(id) => { setPanel('kanban'); setOpenTaskId(id); }}
            onNewTask={openNewTask}
          />
        )}

        {panel === 'kanban' && (
          <>
            <BoardToolbar onNewTask={openNewTask} />
            <Board
              tasks={tasks}
              onMoveTask={moveTask}
              onOpenTask={(id) => setOpenTaskId(id === openTaskId ? null : id)}
              openTaskId={openTaskId}
              density={t.density}
              onNewTask={openNewTask}
            />
            {openTask && (
              <TaskDetail
                task={openTask}
                onClose={() => setOpenTaskId(null)}
                allTasks={tasks}
                onOpenTask={(id) => setOpenTaskId(id)}
                onUpdateTask={updateTask}
              />
            )}
          </>
        )}

        {STUBS[panel] && <Stubs panel={panel} />}
      </div>

      <NewTaskModal
        open={newTaskOpen}
        onClose={() => setNewTaskOpen(false)}
        onCreate={createTask}
        defaultBoardId={boardId}
        allTasks={tasks}
      />

      <Tweaks t={t} setTweak={setTweak} />
    </div>
  );
}

// Lightweight TopBar (replaces the one in the kit because props are different).
function TopBar({ crumb, title, theme, onToggleTheme, sidebarCollapsed, onToggleSidebar }) {
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
      <IconButton icon="menu" label="Toggle sidebar" onClick={onToggleSidebar} />
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
        <IconButton icon={theme === 'dark' ? 'sun' : 'moon'} label="Toggle theme" onClick={onToggleTheme} />
        <IconButton icon="bell" label="Notifications" />
        <span style={{ marginLeft: 4 }}><Avatar initials="JL" size={28} presence="on" /></span>
      </div>
    </header>
  );
}

function BoardToolbar({ onNewTask }) {
  return (
    <div style={{
      padding: '12px 24px', flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 8,
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: 3, background: 'var(--bg-sunken)', borderRadius: 8 }}>
        <ToolbarTab icon="board" label="Board" active />
        <ToolbarTab icon="activity" label="Timeline" />
        <ToolbarTab icon="calendar" label="Calendar" />
      </div>
      <span style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />
      <Button variant="ghost" size="sm" icon="filter">Filter</Button>
      <Button variant="ghost" size="sm" icon="users">Group: Status</Button>
      <span style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <AvatarStack
          people={Object.values(PEOPLE).slice(0, 5).map(p => ({ initials: p.initials }))}
          size={24} max={4}
        />
        <Button variant="primary" size="sm" icon="plus" onClick={onNewTask}>New task</Button>
      </div>
    </div>
  );
}

function ToolbarTab({ icon, label, active }) {
  return (
    <button style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 10px', borderRadius: 6,
      background: active ? 'var(--bg-elevated)' : 'transparent',
      color: active ? 'var(--fg)' : 'var(--fg-muted)',
      border: 0, fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600,
      cursor: 'pointer',
      boxShadow: active ? 'var(--shadow-xs)' : 'none',
      letterSpacing: '-0.005em',
    }}>
      <Icon name={icon} size={13} />
      {label}
    </button>
  );
}

// ---- Tweaks panel -----------------------------------------------------
function AccentSwatches({ value, onChange }) {
  const opts = [
    { id: 'sage',   color: 'oklch(58% 0.095 172)' },
    { id: 'indigo', color: 'oklch(56% 0.18 274)' },
    { id: 'coral',  color: 'oklch(64% 0.16 28)' },
    { id: 'amber',  color: 'oklch(72% 0.15 70)' },
  ];
  return (
    <TweakRow label="Accent">
      <div className="twk-chips" role="radiogroup">
        {opts.map(o => {
          const on = o.id === value;
          return (
            <button
              key={o.id} type="button" role="radio" aria-checked={on}
              className="twk-chip" data-on={on ? '1' : '0'}
              aria-label={o.id} title={o.id}
              style={{ background: o.color }}
              onClick={() => onChange(o.id)}
            />
          );
        })}
      </div>
    </TweakRow>
  );
}

function Tweaks({ t, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Appearance">
        <TweakRadio label="Theme" value={t.theme} onChange={v => setTweak('theme', v)}
          options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
        <AccentSwatches value={t.accent} onChange={v => setTweak('accent', v)} />
      </TweakSection>
      <TweakSection label="Layout">
        <TweakRadio label="Card density" value={t.density} onChange={v => setTweak('density', v)}
          options={[{ value: 'airy', label: 'Airy' }, { value: 'balanced', label: 'Balanced' }, { value: 'dense', label: 'Dense' }]} />
      </TweakSection>
    </TweaksPanel>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
