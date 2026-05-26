import { Outlet } from 'react-router';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';

export default function AppLayout() {

  return (
    <div className="flex w-screen h-screen overflow-hidden" style={{
      background: 'var(--bg)',
      color: 'var(--fg)',
      fontFamily: 'var(--font-sans)',
    }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 relative">
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
}
