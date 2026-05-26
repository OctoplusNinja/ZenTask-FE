import { useState } from 'react';
import { useParams } from 'react-router';
import { TASKS } from '../data/data';
import type { Task, ColId } from '../data/data';
import Board, { BoardToolbar } from '../components/Board/Board';

export default function BoardPage() {
  const { boardId = 'q2' } = useParams<{ boardId: string }>();
  return <BoardContent key={boardId} boardId={boardId} />;
}

function BoardContent({ boardId }: { boardId: string }) {
  const [tasks, setTasks] = useState<Task[]>(() => (TASKS[boardId] ?? []).map(t => ({ ...t })));
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  const moveTask = (id: string, toColId: ColId) => {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, col: toColId } : t));
  };

  const handleOpenTask = (id: string) => {
    setOpenTaskId(prev => prev === id ? null : id);
  };

  return (
    <>
      <BoardToolbar onNewTask={() => {}} />
      <Board
        tasks={tasks}
        onMoveTask={moveTask}
        onOpenTask={handleOpenTask}
        openTaskId={openTaskId}
      />
    </>
  );
}
