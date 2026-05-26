import { createBrowserRouter } from 'react-router';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import StubPanel from './pages/StubPanel';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import SignUp from './pages/SignUp';
import Product from './pages/Product';

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
      { path: '/board/:boardId', element: <StubPanel />, handle: { crumb: 'Product',   title: 'Board' } },
      { path: '/my-tasks',  element: <StubPanel />,  handle: { crumb: 'Workspace', title: 'My tasks' } },
      { path: '/inbox',     element: <StubPanel />,  handle: { crumb: 'Workspace', title: 'Inbox' } },
      { path: '/calendar',  element: <StubPanel />,  handle: { crumb: 'Workspace', title: 'Calendar' } },
      { path: '/reports',   element: <StubPanel />,  handle: { crumb: 'Workspace', title: 'Reports' } },
      { path: '/members',   element: <StubPanel />,  handle: { crumb: 'Workspace', title: 'Members' } },
      { path: '/settings',  element: <StubPanel />,  handle: { crumb: 'Workspace', title: 'Settings' } },
    ],
  },
]);
