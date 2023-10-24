import { lazy } from 'react';

// project imports
import MainLayout from '../layout/MainLayout';
import Loadable from '@app/themes/ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../pages/dashboard')));

// web routing
const PublisherPage = Loadable(lazy(() => import('../pages/publishers/PublisherPage')));
const BookPage = Loadable(lazy(() => import('../pages/books/BookPage')));
const AddBookPage = Loadable(lazy(() => import('../pages/books/AddBookPage')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'publishers',
      element: <PublisherPage />
    },
    {
      path: 'books',
      element: <BookPage />
    },
    {
      path: 'add-book',
      element: <AddBookPage />
    },
  ]
};

export default MainRoutes;
