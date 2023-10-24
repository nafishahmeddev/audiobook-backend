import { lazy } from 'react';

// project imports
import MainLayout from '../layout/MainLayout';
import Loadable from '@app/themes/ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../pages/dashboard')));

// web routing
const AlbumPage = Loadable(lazy(() => import('../pages/album/AlbumPage')));
const AddAlbumPage = Loadable(lazy(() => import('../pages/album/AddAlbumPage')));

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
      path: 'albums',
      element: <AlbumPage />
    },
    {
      path: 'add-albums',
      element: <AddAlbumPage />
    },
  ]
};

export default MainRoutes;
