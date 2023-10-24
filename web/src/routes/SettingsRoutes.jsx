import { lazy } from 'react';

// project imports
import MainLayout from '../layout/MainLayout';
import Loadable from '@app/themes/ui-component/Loadable';

// dashboard routing

//settings page routing
const AuthorPage = Loadable(lazy(() => import('../pages/settings/authors/AuthorPage')));
const ListPage = Loadable(lazy(() => import('../pages/settings/lists/ListPage')));
const GenrePage = Loadable(lazy(() => import('../pages/settings/genres/GenrePage')));

// ==============================|| MAIN ROUTING ||============================== //

const SettingsRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'settings/authors',
      element: <AuthorPage />
    },
    {
      path: 'settings/lists',
      element: <ListPage />
    },
    {
      path: 'settings/genres',
      element: <GenrePage />
    },
  ]
};

export default SettingsRoutes;
