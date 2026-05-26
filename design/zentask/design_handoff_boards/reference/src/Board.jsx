// Board: columns + cards. Includes drag-to-move (simple HTML5 DnD).

function Board({ tasks, onMoveTask, onOpenTask, openTaskId, density = 'balanced' }) {
  const colWidth = density === 'dense' ? 268 : density === 'airy' ? 320 : 304;
  const colGap   = density === 'dense' ? 10  : density === 'airy' ? 16  : 12;
  return (
    <div style={{
      flex: 1, padding: '20px 24px',
      display: 'flex', gap: colGap,
      overflow: 'auto',
      background: 'var(--bg)',
    }}>
      {COLUMNS.map(col => (
        <Column
          key={col.id}
          col={col}
          tasks={tasks.filter(t => t.col === col.id)}
          onMoveTask={onMoveTask}
          onOpenTask={onOpenTask}
          openTaskId={openTaskId}
          density={density}
          colWidth={colWidth}
        />
      ))}
      <button style={{
        width: colWidth, flexShrink: 0,
        background: 'transparent',
        border: '1px dashed var(--border-strong)',
        borderRadius: 16, color: 'var(--fg-muted)',
        fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, padding: '14px 16px', cursor: 'pointer', alignSelf: 'flex-start',
      }}>
        <Icon name="plus" size={14} />
        Add column
      </button>
    </div>
  );
}

function Column({ col, tasks, onMoveTask, onOpenTask, openTaskId, density, colWidth }) {
  const [isOver, setIsOver] = React.useState(false);
  const dotColor = {
    backlog: 'var(--neutral-400)',
    in_progress: 'var(--info)',
    in_review: 'var(--warning)',
    done: 'var(--success)',
  }[col.status] || 'var(--neutral-400)';

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault(); setIsOver(false);
        const id = e.dataTransfer.getData('text/task-id');
        if (id) onMoveTask(id, col.id);
      }}
      style={{
        width: colWidth, flexShrink: 0,
        background: 'var(--bg-sunken)',
        borderRadius: 16,
        padding: density === 'dense' ? 6 : 8,
        outline: isOver ? '2px solid var(--accent)' : '2px solid transparent',
        outlineOffset: -2,
        transition: 'outline-color 120ms var(--ease-out)',
        display: 'flex', flexDirection: 'column',
        maxHeight: 'calc(100vh - 92px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: dotColor, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{col.name}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-subtle)' }}>{tasks.length}</span>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          <IconButton icon="plus" label="Add task" />
          <IconButton icon="more" label="More" />
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: density === 'dense' ? 6 : 8, padding: '0 2px 8px' }}>
        {tasks.map(t => (
          <TaskCard key={t.id} task={t} onOpen={onOpenTask} isOpen={t.id === openTaskId} density={density} />
        ))}
        {tasks.length === 0 && (
          <div style={{
            border: '1px dashed var(--border-strong)',
            borderRadius: 12, padding: 18, textAlign: 'center',
            color: 'var(--fg-subtle)', fontSize: 12,
          }}>Nothing here yet.</div>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, onOpen, isOpen, density = 'balanced' }) {
  const isOverdue = task.due === 'Today' || task.due === 'Yesterday';
  const isUrgent = task.priority >= 4;
  const pad = density === 'dense' ? '10px 12px 10px' : density === 'airy' ? '16px 16px 14px' : '14px 14px 12px';
  return (
    <div
      draggable
      onDragStart={(e) => { e.dataTransfer.setData('text/task-id', task.id); e.dataTransfer.effectAllowed = 'move'; }}
      onClick={() => onOpen(task.id)}
      className="zt-card"
      style={{
        position: 'relative',
        background: 'var(--bg-elevated)',
        border: `1px solid ${isOpen ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 12,
        padding: pad,
        boxShadow: isOpen ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        cursor: 'pointer',
        transition: 'all 160ms var(--ease-out)',
      }}
    >
      {isUrgent && (
        <span style={{
          position: 'absolute', left: 0, top: 12, bottom: 12, width: 3,
          background: 'var(--danger)', borderRadius: '0 3px 3px 0',
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-subtle)', letterSpacing: '-0.01em' }}>{task.id}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {task.tags.map(t => <Tag key={t} name={t} />)}
        </div>
      </div>

      <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, margin: '4px 0 10px', letterSpacing: '-0.005em' }}>
        {task.title}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-muted)', fontSize: 11 }}>
          <PriorityIcon level={task.priority} />
          {task.due && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: isOverdue ? 'var(--danger)' : 'inherit' }}>
              <Icon name="calendar" size={12} />{task.due}
            </span>
          )}
          {task.comments > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <Icon name="message" size={12} />{task.comments}
            </span>
          )}
        </div>
        <AvatarStack
          people={task.assignees.map(k => ({ initials: PEOPLE[k].initials }))}
          size={22} max={3}
        />
      </div>
    </div>
  );
}

Object.assign(window, { Board, Column, TaskCard });
