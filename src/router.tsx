import { createBrowserRouter, Navigate } from 'react-router';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import StubPanel from './pages/StubPanel';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    // children: [
    //   { index: true, element: <Navigate to="/dashboard" replace /> },
    //   {
    //     path: 'dashboard',
    //     element: <Dashboard />,
    //     handle: { crumb: 'Workspace', title: 'Dashboard' },
    //   },
    //   {
    //     path: 'board',
    //     element: <StubPanel />,
    //     handle: { crumb: 'Product', title: 'Boards' },
    //   },
    //   {
    //     path: 'board/:boardId',
    //     element: <StubPanel />,
    //     handle: { crumb: 'Product', title: 'Board' },
    //   },
    //   {
    //     path: 'my-tasks',
    //     element: <StubPanel />,
    //     handle: { crumb: 'Workspace', title: 'My tasks' },
    //   },
    //   {
    //     path: 'inbox',
    //     element: <StubPanel />,
    //     handle: { crumb: 'Workspace', title: 'Inbox' },
    //   },
    //   {
    //     path: 'calendar',
    //     element: <StubPanel />,
    //     handle: { crumb: 'Workspace', title: 'Calendar' },
    //   },
    //   {
    //     path: 'reports',
    //     element: <StubPanel />,
    //     handle: { crumb: 'Workspace', title: 'Reports' },
    //   },
    //   {
    //     path: 'members',
    //     element: <StubPanel />,
    //     handle: { crumb: 'Workspace', title: 'Members' },
    //   },
    //   {
    //     path: 'settings',
    //     element: <StubPanel />,
    //     handle: { crumb: 'Workspace', title: 'Settings' },
    //   },
    // ],
  },
]);
