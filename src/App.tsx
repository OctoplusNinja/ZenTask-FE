import { useState, useEffect } from 'react';
import type { PanelId } from './types';
import { BREADCRUMBS } from './config/navigation';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './pages/Dashboard';
import StubPanel from './pages/StubPanel';

export default function App() {
  const [panel, setPanel] = useState<PanelId>('dashboard');
  const [boardId, setBoardId] = useState('q2');
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const { crumb, title } = BREADCRUMBS[panel] ?? { crumb: 'Workspace', title: '' };

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
        onPanel={(p) => setPanel(p as PanelId)}
        activeBoardId={boardId}
        onSelectBoard={(id) => { setPanel('kanban'); setBoardId(id); }}
        collapsed={collapsed}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        <TopBar
          crumb={crumb}
          title={title}
          theme={theme}
          onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          onToggleSidebar={() => setCollapsed(c => !c)}
        />

        {panel === 'dashboard' && (
          <Dashboard
            onJumpToKanban={() => setPanel('kanban')}
            onOpenTask={() => setPanel('kanban')}
            onNewTask={() => {}}
          />
        )}

        {panel !== 'dashboard' && <StubPanel panel={panel} />}
      </div>
    </div>
  );
}
