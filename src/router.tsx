import { createBrowserRouter, Navigate } from 'react-router';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import BoardPage from './pages/BoardPage';
import StubPanel from './pages/StubPanel';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import SignUp from './pages/SignUp';
import Product from './pages/Product';
import { BOARDS, SPACES } from './data/data';

export const router = createBrowserRouter([
  // ── Marketing pages (standalone, no app shell) ──
  { path: '/',        element: <Landing /> },
  { path: '/product', element: <Product /> },
  { path: '/pricing', element: <Pricing /> },
  { path: '/signup',  element: <SignUp /> },

  // ── App shell (pathless layout route) ──
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard />,  handle: { crumb: 'Workspace', title: 'Dashboard' } },
      { path: '/board',          element: <Navigate to="/board/q2" replace /> },
      {
        path: '/board/:boardId',
        element: <BoardPage />,
        loader: ({ params }) => {
          const board = BOARDS.find(b => b.id === params.boardId);
          const space = SPACES.find(s => s.id === board?.spaceId);
          return { crumb: space?.name ?? 'Product', title: board?.name ?? 'Board' };
        },
      },
      { path: '/my-tasks',  element: <StubPanel />,  handle: { crumb: 'Workspace', title: 'My tasks' } },
      { path: '/inbox',     element: <StubPanel />,  handle: { crumb: 'Workspace', title: 'Inbox' } },
      { path: '/calendar',  element: <StubPanel />,  handle: { crumb: 'Workspace', title: 'Calendar' } },
      { path: '/reports',   element: <StubPanel />,  handle: { crumb: 'Workspace', title: 'Reports' } },
      { path: '/members',   element: <StubPanel />,  handle: { crumb: 'Workspace', title: 'Members' } },
      { path: '/settings',  element: <StubPanel />,  handle: { crumb: 'Workspace', title: 'Settings' } },
    ],
  },
]);
