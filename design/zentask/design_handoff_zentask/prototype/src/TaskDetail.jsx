// Task detail: right-side overlay panel. Read-only-feeling, but with inputs
// shaped like the real product. Pure UI; no save handling beyond local state.

function TaskDetail({ task, onClose, allTasks, onOpenTask, onUpdateTask }) {
  if (!task) return null;
  const people = task.assignees.map(k => PEOPLE[k]);
  const priorityLabel = ['Low', 'Medium', 'High', 'Urgent'][task.priority - 1];
  const status = COLUMNS.find(c => c.id === task.col);
  const tasksList = allTasks || [];
  const children = (task.children || []).map(id => SUBTASKS[id]).filter(Boolean);
  const links = task.links || [];

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'color-mix(in oklch, var(--bg-inverse) 30%, transparent)',
          backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
          zIndex: 20,
          animation: 'zt-fade 200ms var(--ease-out)',
        }}
      />
      {/* Panel */}
      <aside
        style={{
          position: 'absolute', top: 0, right: 0, bottom: 0,
          width: 480, maxWidth: '90vw',
          background: 'var(--bg-elevated)',
          borderLeft: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 21,
          display: 'flex', flexDirection: 'column',
          animation: 'zt-slide 240ms var(--ease-out)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-subtle)' }}>{task.id}</span>
          <span style={{ width: 1, height: 14, background: 'var(--border)' }} />
          <StatusBadge status={status.status} label={status.name} />
          <span style={{ flex: 1 }} />
          <IconButton icon="link" label="Copy link" />
          <IconButton icon="more" label="More" />
          <IconButton icon="x" label="Close" onClick={onClose} />
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px 28px' }}>
          <h1 style={{
            fontSize: 22, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.018em',
            margin: '0 0 16px',
          }}>
            {task.title}
          </h1>

          <DetailRow label="Status">
            <button className="zt-detail-pick">
              <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--info)' }} />
              {status.name}
              <Icon name="chevdown" size={12} style={{ color: 'var(--fg-subtle)', marginLeft: 'auto' }} />
            </button>
          </DetailRow>

          <DetailRow label="Assignees">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {people.map(p => (
                <span key={p.initials} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'var(--bg-sunken)', borderRadius: 999,
                  padding: '3px 10px 3px 3px', fontSize: 12.5, fontWeight: 500,
                }}>
                  <Avatar initials={p.initials} size={20} />
                  {p.name}
                </span>
              ))}
              <button className="zt-detail-pick" style={{ minWidth: 0, padding: '4px 8px' }}>
                <Icon name="plus" size={12} />
                Add
              </button>
            </div>
          </DetailRow>

          <DetailRow label="Priority">
            <button className="zt-detail-pick">
              <PriorityIcon level={task.priority} />
              {priorityLabel}
              <Icon name="chevdown" size={12} style={{ color: 'var(--fg-subtle)', marginLeft: 'auto' }} />
            </button>
          </DetailRow>

          <DetailRow label="Due">
            <button className="zt-detail-pick">
              <Icon name="calendar" size={13} style={{ color: 'var(--fg-subtle)' }} />
              {task.due || 'No date'}
              <Icon name="chevdown" size={12} style={{ color: 'var(--fg-subtle)', marginLeft: 'auto' }} />
            </button>
          </DetailRow>

          <DetailRow label="Labels">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {task.tags.map(t => <Tag key={t} name={t} />)}
              <button className="zt-detail-pick" style={{ minWidth: 0, padding: '4px 8px' }}>
                <Icon name="plus" size={12} />
                Add label
              </button>
            </div>
          </DetailRow>

          {/* Description */}
          <div style={{ marginTop: 22 }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBottom: 8 }}>
              Description
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg)' }}>
              <p style={{ margin: '0 0 8px' }}>
                We need to move the current email-and-password login over to our OAuth provider so SSO works for enterprise customers.
              </p>
              <p style={{ margin: 0 }}>
                Acceptance: customers can sign in via Google and Okta. Sessions persist across reloads. The existing migration path keeps grandfathered accounts working.
              </p>
            </div>
          </div>

          {/* Sub-tasks */}
          <SubtasksSection
            task={task}
            subtasks={children}
            onUpdateTask={onUpdateTask}
          />

          {/* Linked tasks */}
          <LinksSection
            task={task}
            links={links}
            allTasks={tasksList}
            onOpenTask={onOpenTask}
            onUpdateTask={onUpdateTask}
          />

          {/* Activity */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBottom: 10 }}>
              Activity
            </div>
            <ActivityRow person={PEOPLE.rt} text="moved this from Backlog to In progress" when="2h ago" />
            <ActivityRow person={PEOPLE.jl} text="left a comment" when="38m ago" comment="Going to scope the migration tonight — should land Thursday." />
          </div>
        </div>

        {/* Composer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 8 }}>
          <Avatar initials="JL" size={26} />
          <input
            placeholder="Add a comment…"
            style={{
              flex: 1, background: 'var(--bg-sunken)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '7px 12px', fontFamily: 'inherit', fontSize: 13,
              outline: 'none', color: 'var(--fg)',
            }}
          />
          <Button variant="primary" size="sm">Comment</Button>
        </div>
      </aside>

      <style>{`
        @keyframes zt-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zt-slide { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .zt-detail-pick {
          display: flex; align-items: center; gap: 8px;
          background: var(--bg-sunken); border: 1px solid var(--border);
          border-radius: 8px; padding: 7px 10px;
          font-family: inherit; font-size: 12.5px; font-weight: 500;
          color: var(--fg); cursor: pointer; min-width: 200px;
          transition: all 120ms var(--ease-out);
        }
        .zt-detail-pick:hover { background: var(--bg-hover); border-color: var(--border-strong); }
      `}</style>
    </>
  );
}

function DetailRow({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
      <div style={{ width: 90, flexShrink: 0, fontSize: 12, color: 'var(--fg-muted)', fontWeight: 500, paddingTop: 7 }}>{label}</div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}

function ActivityRow({ person, text, when, comment }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
      <Avatar initials={person.initials} size={24} />
      <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.5 }}>
        <div>
          <span style={{ fontWeight: 600 }}>{person.name}</span>
          <span style={{ color: 'var(--fg-muted)' }}> {text}</span>
          <span style={{ color: 'var(--fg-subtle)', marginLeft: 6, fontSize: 11.5 }}>{when}</span>
        </div>
        {comment && (
          <div style={{
            marginTop: 6, padding: '8px 12px',
            background: 'var(--bg-sunken)', borderRadius: 8,
            color: 'var(--fg)', fontSize: 13,
          }}>{comment}</div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { TaskDetail });

// ── Sub-tasks ───────────────────────────────────────────────────────────
function SubtasksSection({ task, subtasks, onUpdateTask }) {
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const done = subtasks.filter(s => s.done).length;
  const total = subtasks.length;

  if (total === 0 && !adding) {
    return (
      <Section title="Sub-tasks">
        <button onClick={() => setAdding(true)} className="zt-detail-pick" style={{ minWidth: 0, padding: '6px 10px', width: '100%', justifyContent: 'flex-start' }}>
          <Icon name="plus" size={12} />
          Add sub-task
        </button>
      </Section>
    );
  }

  return (
    <Section
      title="Sub-tasks"
      meta={total > 0 && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-subtle)' }}>
          {done}/{total}
        </span>
      )}
      action={!adding && (
        <button onClick={() => setAdding(true)} className="zt-mini-add">
          <Icon name="plus" size={11} />Add
        </button>
      )}
    >
      {/* progress bar */}
      {total > 0 && (
        <div style={{ height: 3, background: 'var(--bg-sunken)', borderRadius: 999, marginBottom: 8, overflow: 'hidden' }}>
          <div style={{ width: `${(done / total) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 999, transition: 'width 240ms var(--ease-out)' }} />
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {subtasks.map(s => (
          <SubtaskRow key={s.id} sub={s} onToggle={() => {
            SUBTASKS[s.id] = { ...s, done: !s.done };
            onUpdateTask && onUpdateTask({ ...task });
          }} />
        ))}
      </div>
      {adding && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <span style={{ width: 14, height: 14, border: '1.5px dashed var(--border-strong)', borderRadius: 4, flexShrink: 0 }} />
          <input
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && draft.trim()) {
                const nid = `${task.id}-${Date.now().toString(36).slice(-3)}`;
                SUBTASKS[nid] = { id: nid, parent: task.id, title: draft.trim(), done: false, assignee: 'jl' };
                const next = { ...task, children: [...(task.children || []), nid] };
                onUpdateTask && onUpdateTask(next);
                setDraft('');
              } else if (e.key === 'Escape') {
                setAdding(false); setDraft('');
              }
            }}
            placeholder="Sub-task title — Enter to add, Esc to cancel"
            style={{
              flex: 1, background: 'transparent', border: 0, outline: 'none',
              fontFamily: 'inherit', fontSize: 13, color: 'var(--fg)',
              padding: '4px 0',
            }}
          />
        </div>
      )}
    </Section>
  );
}

function SubtaskRow({ sub, onToggle }) {
  const p = PEOPLE[sub.assignee];
  return (
    <div className="zt-row" style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 4px', borderRadius: 6,
    }}>
      <button onClick={onToggle} aria-label="Toggle done" style={{
        width: 16, height: 16, flexShrink: 0,
        borderRadius: 4, border: `1.5px solid ${sub.done ? 'var(--accent)' : 'var(--border-strong)'}`,
        background: sub.done ? 'var(--accent)' : 'transparent',
        color: 'var(--fg-on-accent)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', padding: 0,
      }}>
        {sub.done && <Icon name="check" size={10} strokeWidth={3} />}
      </button>
      <span style={{
        flex: 1, minWidth: 0, fontSize: 12.5, letterSpacing: '-0.005em',
        textDecoration: sub.done ? 'line-through' : 'none',
        color: sub.done ? 'var(--fg-subtle)' : 'var(--fg)',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{sub.title}</span>
      {p && <Avatar initials={p.initials} size={18} />}
    </div>
  );
}

// ── Linked tasks ────────────────────────────────────────────────────────
function LinksSection({ task, links, allTasks, onOpenTask, onUpdateTask }) {
  const [picker, setPicker] = React.useState(null); // null | kind id

  if (links.length === 0 && !picker) {
    return (
      <Section title="Relations">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {Object.entries(LINK_KINDS).map(([k, def]) => (
            <button key={k} onClick={() => setPicker(k)} className="zt-link-add">
              <span style={{ color: def.color, fontWeight: 700, marginRight: 2 }}>{def.arrow}</span>
              {def.label}
            </button>
          ))}
        </div>
      </Section>
    );
  }

  // Group by kind
  const grouped = links.reduce((acc, l) => {
    (acc[l.kind] = acc[l.kind] || []).push(l);
    return acc;
  }, {});

  return (
    <Section
      title="Relations"
      meta={links.length > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-subtle)' }}>{links.length}</span>}
      action={
        <div style={{ position: 'relative' }}>
          <button onClick={() => setPicker(picker ? null : 'menu')} className="zt-mini-add">
            <Icon name="plus" size={11} />Link
          </button>
          {picker === 'menu' && (
            <div className="zt-menu" style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)' }}>
              {Object.entries(LINK_KINDS).map(([k, def]) => (
                <button key={k} className="zt-menu-item" onClick={() => setPicker(k)}>
                  <span style={{ color: def.color, fontWeight: 700, width: 14 }}>{def.arrow}</span>
                  {def.label}
                </button>
              ))}
            </div>
          )}
        </div>
      }
    >
      {Object.entries(grouped).map(([kind, ls]) => (
        <LinkGroup
          key={kind}
          kind={kind}
          links={ls}
          allTasks={allTasks}
          onOpenTask={onOpenTask}
          onRemove={(linkedId) => {
            const next = { ...task, links: (task.links || []).filter(l => !(l.kind === kind && l.id === linkedId)) };
            onUpdateTask && onUpdateTask(next);
          }}
        />
      ))}
      {picker && picker !== 'menu' && (
        <LinkPicker
          kind={picker}
          allTasks={allTasks}
          excludeIds={[task.id, ...(task.links || []).map(l => l.id)]}
          onCancel={() => setPicker(null)}
          onPick={(id) => {
            const next = { ...task, links: [...(task.links || []), { kind: picker, id }] };
            onUpdateTask && onUpdateTask(next);
            setPicker(null);
          }}
        />
      )}
    </Section>
  );
}

function LinkGroup({ kind, links, allTasks, onOpenTask, onRemove }) {
  const def = LINK_KINDS[kind];
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
        color: 'var(--fg-subtle)', marginBottom: 4,
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ color: def.color }}>{def.arrow}</span>
        {def.label}
      </div>
      {links.map(l => {
        const linked = allTasks.find(t => t.id === l.id);
        if (!linked) return null;
        const status = COLUMNS.find(c => c.id === linked.col);
        return (
          <div key={l.id} className="zt-link-card" onClick={() => onOpenTask && onOpenTask(l.id)}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-subtle)', flexShrink: 0 }}>{linked.id}</span>
            <span style={{
              flex: 1, minWidth: 0,
              fontSize: 12.5, fontWeight: 500, letterSpacing: '-0.005em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{linked.title}</span>
            <StatusBadge status={linked.col} label={status?.name || ''} />
            <button onClick={(e) => { e.stopPropagation(); onRemove(l.id); }} aria-label="Remove link" className="zt-link-x">
              <Icon name="x" size={11} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function LinkPicker({ kind, allTasks, excludeIds, onCancel, onPick }) {
  const [q, setQ] = React.useState('');
  const results = allTasks
    .filter(t => !excludeIds.includes(t.id))
    .filter(t => !q || (t.title + ' ' + t.id).toLowerCase().includes(q.toLowerCase()))
    .slice(0, 6);
  const def = LINK_KINDS[kind];
  return (
    <div style={{
      marginTop: 8,
      background: 'var(--bg-sunken)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 6px 8px', borderBottom: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--fg-muted)' }}>
          <span style={{ color: def.color, fontWeight: 700 }}>{def.arrow}</span> Link as <strong style={{ color: 'var(--fg)' }}>{def.label.toLowerCase()}</strong>
        </span>
        <span style={{ flex: 1 }} />
        <button onClick={onCancel} className="zt-link-x" aria-label="Cancel"><Icon name="x" size={11} /></button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 6px 4px' }}>
        <Icon name="search" size={12} style={{ color: 'var(--fg-subtle)' }} />
        <input
          autoFocus value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search by title or ID…"
          style={{ flex: 1, background: 'transparent', border: 0, outline: 'none', fontFamily: 'inherit', fontSize: 12.5, color: 'var(--fg)' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 200, overflow: 'auto', paddingTop: 4 }}>
        {results.map(t => (
          <button key={t.id} onClick={() => onPick(t.id)} className="zt-pick-row">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-subtle)' }}>{t.id}</span>
            <span style={{
              flex: 1, minWidth: 0, textAlign: 'left',
              fontSize: 12.5, letterSpacing: '-0.005em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{t.title}</span>
          </button>
        ))}
        {results.length === 0 && (
          <div style={{ padding: '14px 8px', textAlign: 'center', fontSize: 11.5, color: 'var(--fg-subtle)' }}>No matches.</div>
        )}
      </div>
    </div>
  );
}

// Shared section frame for sub-tasks/relations/activity.
function Section({ title, meta, action, children }) {
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>
          {title}
        </span>
        {meta}
        <span style={{ flex: 1 }} />
        {action}
      </div>
      {children}
    </div>
  );
}

// Extra styles for the new sections, dumped into the existing zt-detail-pick block.
(function () {
  const id = 'zt-detail-extra-styles';
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id;
  s.textContent = `
    .zt-mini-add {
      display: inline-flex; align-items: center; gap: 4px;
      background: transparent; border: 0;
      color: var(--fg-muted); cursor: pointer;
      font-family: inherit; font-size: 11.5px; font-weight: 600;
      padding: 3px 6px; border-radius: 6px; letter-spacing: -0.005em;
    }
    .zt-mini-add:hover { background: var(--bg-hover); color: var(--fg); }

    .zt-link-add {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--bg-sunken); border: 1px solid var(--border);
      color: var(--fg-muted); cursor: pointer;
      font-family: inherit; font-size: 11.5px; font-weight: 500;
      padding: 4px 9px; border-radius: 999px; letter-spacing: -0.005em;
    }
    .zt-link-add:hover { background: var(--bg-hover); border-color: var(--border-strong); color: var(--fg); }

    .zt-link-card {
      display: flex; align-items: center; gap: 10px;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 7px 8px 7px 10px;
      margin-bottom: 4px;
      cursor: pointer;
      transition: all 120ms var(--ease-out);
    }
    .zt-link-card:hover { border-color: var(--border-strong); box-shadow: var(--shadow-xs); }

    .zt-link-x {
      width: 20px; height: 20px;
      background: transparent; border: 0;
      color: var(--fg-subtle); cursor: pointer;
      border-radius: 4px;
      display: inline-flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .zt-link-x:hover { background: var(--bg-hover); color: var(--fg); }

    .zt-pick-row {
      display: flex; align-items: center; gap: 8px;
      background: transparent; border: 0;
      padding: 7px 8px; border-radius: 6px;
      cursor: pointer; font-family: inherit;
      color: var(--fg);
    }
    .zt-pick-row:hover { background: var(--bg-hover); }

    .zt-menu {
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      padding: 4px;
      z-index: 30;
      min-width: 160px;
    }
    .zt-menu-item {
      display: flex; align-items: center; gap: 8px;
      width: 100%; padding: 6px 8px;
      background: transparent; border: 0;
      font-family: inherit; font-size: 12.5px; font-weight: 500;
      color: var(--fg); cursor: pointer;
      border-radius: 6px; text-align: left;
    }
    .zt-menu-item:hover { background: var(--bg-hover); }
  `;
  document.head.appendChild(s);
})();