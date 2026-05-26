// New task modal — opens from "New task" buttons everywhere.
// Centered modal w/ scrim. Fields: title, description, board, status,
// priority, assignees, due, labels, link-to (existing task).

function NewTaskModal({ open, onClose, onCreate, defaultBoardId = 'q2', defaultCol = 'backlog', allTasks = [] }) {
  const [title, setTitle] = React.useState('');
  const [desc, setDesc]   = React.useState('');
  const [boardId, setBoardId] = React.useState(defaultBoardId);
  const [col, setCol]     = React.useState(defaultCol);
  const [priority, setPriority] = React.useState(2);
  const [assignees, setAssignees] = React.useState(['jl']);
  const [due, setDue]     = React.useState('');
  const [labels, setLabels] = React.useState([]);
  const [link, setLink]   = React.useState(null); // { kind, id }
  const [showLink, setShowLink] = React.useState(false);
  const titleRef = React.useRef(null);

  // Reset + focus when opened
  React.useEffect(() => {
    if (open) {
      setTitle(''); setDesc(''); setBoardId(defaultBoardId); setCol(defaultCol);
      setPriority(2); setAssignees(['jl']); setDue(''); setLabels([]); setLink(null); setShowLink(false);
      requestAnimationFrame(() => titleRef.current && titleRef.current.focus());
    }
  }, [open, defaultBoardId, defaultCol]);

  // Esc to close, Cmd/Ctrl+Enter to submit
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleCreate();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  if (!open) return null;

  const handleCreate = () => {
    if (!title.trim()) return;
    const newId = `ZT-${1200 + Math.floor(Math.random() * 99)}`;
    const newTask = {
      id: newId,
      col,
      title: title.trim(),
      desc: desc.trim() || null,
      tags: labels,
      priority,
      due: due || null,
      assignees,
      comments: 0,
      links: link ? [link] : [],
    };
    onCreate(newTask, boardId);
    onClose();
  };

  const toggleAssignee = (key) => {
    setAssignees(a => a.includes(key) ? a.filter(k => k !== key) : [...a, key]);
  };
  const toggleLabel = (name) => {
    setLabels(l => l.includes(name) ? l.filter(k => k !== name) : [...l, name]);
  };

  const LABELS = ['bug', 'design', 'growth', 'infra', 'research', 'docs'];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '80px 24px 24px',
      animation: 'zt-fade 160ms var(--ease-out)',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'color-mix(in oklch, var(--bg-inverse) 40%, transparent)',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      }} />

      <div role="dialog" aria-label="New task" style={{
        position: 'relative',
        width: '100%', maxWidth: 640,
        maxHeight: 'calc(100vh - 100px)',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        boxShadow: 'var(--shadow-2xl, var(--shadow-xl))',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        animation: 'zt-modal-in 220ms var(--ease-out)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px 12px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <span style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="plus" size={15} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.015em' }}>New task</div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-subtle)' }}>Capture something to do. Press <kbd style={kbdStyle}>⌘</kbd>+<kbd style={kbdStyle}>↵</kbd> to create.</div>
          </div>
          <IconButton icon="x" label="Close" onClick={onClose} />
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '18px 18px 8px' }}>
          <input
            ref={titleRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What needs doing?"
            style={{
              width: '100%', boxSizing: 'border-box',
              border: 0, outline: 'none', background: 'transparent',
              fontFamily: 'inherit',
              fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em',
              color: 'var(--fg)',
              padding: '4px 0 6px',
            }}
          />
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Add a description, acceptance criteria, or paste a link…"
            rows={3}
            style={{
              width: '100%', boxSizing: 'border-box',
              border: 0, outline: 'none', background: 'transparent',
              fontFamily: 'inherit',
              fontSize: 13.5, lineHeight: 1.5, letterSpacing: '-0.005em',
              color: 'var(--fg)', resize: 'vertical',
              padding: '4px 0 12px',
            }}
          />

          {/* Property grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            columnGap: 14, rowGap: 6,
            paddingTop: 6,
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <PropRow label="Board" icon="board">
              <Select value={boardId} onChange={setBoardId}
                options={BOARDS.map(b => ({ value: b.id, label: b.name }))} />
            </PropRow>

            <PropRow label="Status" icon="circle">
              <ColumnPicker value={col} onChange={setCol} />
            </PropRow>

            <PropRow label="Priority" icon="flag">
              <PriorityPicker value={priority} onChange={setPriority} />
            </PropRow>

            <PropRow label="Assignees" icon="user">
              <AssigneePicker value={assignees} onToggle={toggleAssignee} />
            </PropRow>

            <PropRow label="Due" icon="calendar">
              <DuePicker value={due} onChange={setDue} />
            </PropRow>

            <PropRow label="Labels" icon="tag">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {LABELS.map(l => {
                  const on = labels.includes(l);
                  return (
                    <button key={l} onClick={() => toggleLabel(l)} className="zt-label-pick" data-on={on}>
                      <Tag name={l} />
                    </button>
                  );
                })}
              </div>
            </PropRow>

            <PropRow label="Linked to" icon="link">
              {link ? (
                <LinkedPreview link={link} allTasks={allTasks} onRemove={() => setLink(null)} />
              ) : showLink ? (
                <LinkInlinePicker
                  allTasks={allTasks}
                  onPick={(picked) => { setLink(picked); setShowLink(false); }}
                  onCancel={() => setShowLink(false)}
                />
              ) : (
                <button onClick={() => setShowLink(true)} className="zt-detail-pick" style={{ minWidth: 0, padding: '5px 9px' }}>
                  <Icon name="plus" size={11} />
                  Link to a task
                </button>
              )}
            </PropRow>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-sunken)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 11.5, color: 'var(--fg-subtle)' }}>
            Will appear in <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>
              {BOARDS.find(b => b.id === boardId)?.name}
            </strong> · <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>
              {COLUMNS.find(c => c.id === col)?.name}
            </strong>
          </span>
          <span style={{ flex: 1 }} />
          <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" icon="plus" onClick={handleCreate} disabled={!title.trim()}
            style={{ opacity: title.trim() ? 1 : 0.45, pointerEvents: title.trim() ? 'auto' : 'none' }}>
            Create task
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes zt-modal-in {
          from { transform: translateY(-8px) scale(0.985); opacity: 0; }
          to   { transform: translateY(0)     scale(1);     opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const kbdStyle = {
  fontFamily: 'var(--font-mono)', fontSize: 10,
  background: 'var(--bg-sunken)', border: '1px solid var(--border)',
  borderRadius: 3, padding: '0 4px',
};

function PropRow({ label, icon, children }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 0', minWidth: 96, fontSize: 12, color: 'var(--fg-muted)', fontWeight: 500 }}>
        <Icon name={icon} size={13} style={{ color: 'var(--fg-subtle)' }} />
        {label}
      </div>
      <div style={{ padding: '4px 0', minWidth: 0 }}>{children}</div>
    </>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="zt-select">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function ColumnPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {COLUMNS.map(c => {
        const dotColor = c.id === 'backlog' ? 'var(--neutral-400)' : c.id === 'in_progress' ? 'var(--info)' : c.id === 'in_review' ? 'var(--warning)' : 'var(--success)';
        const on = c.id === value;
        return (
          <button key={c.id} onClick={() => onChange(c.id)} className="zt-pill" data-on={on}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: dotColor }} />
            {c.name}
          </button>
        );
      })}
    </div>
  );
}

function PriorityPicker({ value, onChange }) {
  const opts = [{ v: 1, l: 'Low' }, { v: 2, l: 'Medium' }, { v: 3, l: 'High' }, { v: 4, l: 'Urgent' }];
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {opts.map(o => (
        <button key={o.v} onClick={() => onChange(o.v)} className="zt-pill" data-on={o.v === value}>
          <PriorityIcon level={o.v} />
          {o.l}
        </button>
      ))}
    </div>
  );
}

function AssigneePicker({ value, onToggle }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {Object.entries(PEOPLE).map(([k, p]) => {
        const on = value.includes(k);
        return (
          <button key={k} onClick={() => onToggle(k)} className="zt-chip-person" data-on={on}>
            <Avatar initials={p.initials} size={18} />
            <span style={{ fontSize: 12, fontWeight: 500 }}>{p.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function DuePicker({ value, onChange }) {
  const presets = [
    { v: 'Today',      l: 'Today' },
    { v: 'May 24',     l: 'Tomorrow' },
    { v: 'May 29',     l: 'This week' },
    { v: 'Jun 06',     l: 'Next week' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
      {presets.map(p => (
        <button key={p.v} onClick={() => onChange(value === p.v ? '' : p.v)} className="zt-pill" data-on={value === p.v}>
          {p.l}
        </button>
      ))}
      <input
        value={value} onChange={e => onChange(e.target.value)}
        placeholder="or type a date"
        style={{
          background: 'var(--bg-sunken)', border: '1px solid var(--border)',
          borderRadius: 6, padding: '4px 10px',
          fontFamily: 'inherit', fontSize: 12, color: 'var(--fg)', outline: 'none',
          width: 110,
        }}
      />
    </div>
  );
}

function LinkInlinePicker({ allTasks, onPick, onCancel }) {
  const [kind, setKind] = React.useState('related');
  const [q, setQ] = React.useState('');
  const results = allTasks
    .filter(t => !q || (t.title + ' ' + t.id).toLowerCase().includes(q.toLowerCase()))
    .slice(0, 5);
  return (
    <div style={{
      background: 'var(--bg-sunken)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: 8,
      width: '100%',
      maxWidth: 400,
    }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6, flexWrap: 'wrap' }}>
        {Object.entries(LINK_KINDS).map(([k, def]) => (
          <button key={k} onClick={() => setKind(k)} className="zt-pill" data-on={k === kind}>
            <span style={{ color: def.color, fontWeight: 700 }}>{def.arrow}</span>
            {def.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px', background: 'var(--bg-elevated)', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
        <Icon name="search" size={12} style={{ color: 'var(--fg-subtle)' }} />
        <input autoFocus value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search tasks…"
          style={{ flex: 1, border: 0, outline: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 12.5, color: 'var(--fg)' }} />
        <button onClick={onCancel} className="zt-link-x" aria-label="Cancel"><Icon name="x" size={11} /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 6, maxHeight: 160, overflow: 'auto' }}>
        {results.map(t => (
          <button key={t.id} onClick={() => onPick({ kind, id: t.id })} className="zt-pick-row">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-subtle)' }}>{t.id}</span>
            <span style={{ flex: 1, minWidth: 0, textAlign: 'left', fontSize: 12.5, letterSpacing: '-0.005em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function LinkedPreview({ link, allTasks, onRemove }) {
  const t = allTasks.find(x => x.id === link.id);
  const def = LINK_KINDS[link.kind];
  if (!t) return null;
  return (
    <div className="zt-link-card" style={{ marginBottom: 0, cursor: 'default' }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: def.color }}>{def.arrow} {def.label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-subtle)' }}>{t.id}</span>
      <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</span>
      <button onClick={onRemove} className="zt-link-x" aria-label="Remove"><Icon name="x" size={11} /></button>
    </div>
  );
}

// Styles
(function () {
  const id = 'zt-newtask-styles';
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id;
  s.textContent = `
    .zt-select {
      background: var(--bg-sunken); border: 1px solid var(--border);
      border-radius: 6px; padding: 5px 10px;
      font-family: inherit; font-size: 12.5px; font-weight: 500;
      color: var(--fg); cursor: pointer;
    }
    .zt-pill {
      display: inline-flex; align-items: center; gap: 5px;
      background: var(--bg-sunken); border: 1px solid var(--border-subtle);
      color: var(--fg-muted); cursor: pointer;
      font-family: inherit; font-size: 11.5px; font-weight: 500;
      padding: 4px 9px; border-radius: 999px; letter-spacing: -0.005em;
      transition: all 120ms var(--ease-out);
    }
    .zt-pill:hover { background: var(--bg-hover); color: var(--fg); }
    .zt-pill[data-on="true"] {
      background: var(--accent-soft);
      color: var(--accent-soft-fg);
      border-color: transparent;
      font-weight: 600;
    }
    .zt-chip-person {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--bg-sunken); border: 1px solid var(--border-subtle);
      color: var(--fg-muted); cursor: pointer;
      font-family: inherit;
      padding: 3px 10px 3px 3px; border-radius: 999px;
      transition: all 120ms var(--ease-out);
    }
    .zt-chip-person:hover { background: var(--bg-hover); }
    .zt-chip-person[data-on="true"] {
      background: var(--accent-soft);
      color: var(--accent-soft-fg);
      border-color: transparent;
      font-weight: 600;
    }
    .zt-label-pick {
      background: transparent; border: 1px solid transparent;
      padding: 2px 2px; border-radius: 6px; cursor: pointer;
      opacity: 0.55; transition: all 120ms var(--ease-out);
    }
    .zt-label-pick:hover { opacity: 0.9; }
    .zt-label-pick[data-on="true"] { opacity: 1; background: var(--bg-sunken); }
  `;
  document.head.appendChild(s);
})();

Object.assign(window, { NewTaskModal });
