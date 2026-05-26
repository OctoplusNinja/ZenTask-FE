import { useState } from 'react';
import { Icon } from '../ui/Icon';
import { Button, IconButton } from '../ui/Button';
import { AvatarStack } from '../ui/Avatar';
import { Tag, PriorityIcon } from '../ui/Tag';
import { COLUMNS, PEOPLE } from '../../data/data';
import type { Task, ColId, Column } from '../../data/data';

// ---- BoardToolbar --------------------------------------------------------

export function BoardToolbar({ onNewTask }: { onNewTask: () => void }) {
  return (
    <div style={{
      padding: '12px 24px', flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 8,
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: 3, background: 'var(--bg-sunken)', borderRadius: 8,
      }}>
        <ToolbarTab icon="board"    label="Board"    active />
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

function ToolbarTab({ icon, label, active }: { icon: string; label: string; active?: boolean }) {
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
      transition: 'all 120ms var(--ease-out)',
    }}>
      <Icon name={icon} size={13} />
      {label}
    </button>
  );
}

// ---- Board ---------------------------------------------------------------

interface BoardProps {
  tasks: Task[];
  onMoveTask: (id: string, toColId: ColId) => void;
  onOpenTask: (id: string) => void;
  openTaskId: string | null;
}

export default function Board({ tasks, onMoveTask, onOpenTask, openTaskId }: BoardProps) {
  const colWidth = 304;
  return (
    <div style={{
      flex: 1, padding: '20px 24px',
      display: 'flex', gap: 12,
      overflowX: 'auto',
      background: 'var(--bg)',
    }}>
      {COLUMNS.map(col => (
        <BoardColumn
          key={col.id}
          col={col}
          tasks={tasks.filter(t => t.col === col.id)}
          onMoveTask={onMoveTask}
          onOpenTask={onOpenTask}
          openTaskId={openTaskId}
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
        transition: 'all 120ms var(--ease-out)',
      }}>
        <Icon name="plus" size={14} />
        Add column
      </button>
    </div>
  );
}

// ---- Column --------------------------------------------------------------

const DOT_COLOR: Record<ColId, string> = {
  backlog:     'var(--neutral-400)',
  in_progress: 'var(--info)',
  in_review:   'var(--warning)',
  done:        'var(--success)',
};

interface ColumnProps {
  col: Column;
  tasks: Task[];
  onMoveTask: (id: string, toColId: ColId) => void;
  onOpenTask: (id: string) => void;
  openTaskId: string | null;
  colWidth: number;
}

function BoardColumn({ col, tasks, onMoveTask, onOpenTask, openTaskId, colWidth }: ColumnProps) {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      onDragOver={e => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={e => {
        e.preventDefault();
        setIsOver(false);
        const id = e.dataTransfer.getData('text/task-id');
        if (id) onMoveTask(id, col.id);
      }}
      style={{
        width: colWidth, flexShrink: 0,
        background: 'var(--bg-sunken)',
        borderRadius: 16,
        padding: 8,
        outline: isOver ? '2px solid var(--accent)' : '2px solid transparent',
        outlineOffset: -2,
        transition: 'outline-color 120ms var(--ease-out)',
        display: 'flex', flexDirection: 'column',
        maxHeight: 'calc(100vh - 148px)',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 8px 10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{
            width: 8, height: 8, borderRadius: 999,
            background: DOT_COLOR[col.id], flexShrink: 0,
          }} />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
            {col.name}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-subtle)' }}>
            {tasks.length}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          <IconButton icon="plus" label="Add task" />
          <IconButton icon="more" label="More" />
        </div>
      </div>

      <div style={{
        flex: 1, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 8,
        padding: '0 2px 8px',
      }}>
        {tasks.map(t => (
          <TaskCard
            key={t.id}
            task={t}
            onOpen={onOpenTask}
            isOpen={t.id === openTaskId}
          />
        ))}
        {tasks.length === 0 && (
          <div style={{
            border: '1px dashed var(--border-strong)',
            borderRadius: 12, padding: 18, textAlign: 'center',
            color: 'var(--fg-subtle)', fontSize: 12,
          }}>
            Nothing here yet.
          </div>
        )}
      </div>
    </div>
  );
}

// ---- TaskCard ------------------------------------------------------------

function TaskCard({ task, onOpen, isOpen }: { task: Task; onOpen: (id: string) => void; isOpen: boolean }) {
  const isOverdue = task.due === 'Today' || task.due === 'Yesterday';
  const isUrgent  = task.priority >= 4;

  return (
    <div
      draggable
      onDragStart={e => {
        e.dataTransfer.setData('text/task-id', task.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={() => onOpen(task.id)}
      className="zt-card"
      style={{
        position: 'relative',
        background: 'var(--bg-elevated)',
        border: `1px solid ${isOpen ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 12,
        padding: '14px 14px 12px',
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
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-subtle)', letterSpacing: '-0.01em' }}>
          {task.id}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {task.tags.map(tag => <Tag key={tag} name={tag} />)}
        </div>
      </div>

      <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, margin: '4px 0 10px', letterSpacing: '-0.005em' }}>
        {task.title}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-muted)', fontSize: 11 }}>
          <PriorityIcon level={task.priority} />
          {task.due && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              color: isOverdue ? 'var(--danger)' : 'inherit',
            }}>
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
          people={task.assignees.map(k => ({ initials: PEOPLE[k]?.initials ?? k.slice(0, 2).toUpperCase() }))}
          size={22} max={3}
        />
      </div>
    </div>
  );
}
