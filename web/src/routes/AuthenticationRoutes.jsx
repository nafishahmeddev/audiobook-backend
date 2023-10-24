import { lazy } from 'react';

// project imports
import Loadable from '@app/themes/ui-component/Loadable';
import MinimalLayout from '../layout/MinimalLayout';

// login option 3 routing
const AuthLogin = Loadable(lazy(() => import('../pages/authentication/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('../pages/authentication/authentication/Register')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/pages/login/login',
      element: <AuthLogin />
    },
    {
      path: '/pages/register/register',
      element: <AuthRegister />
    }
  ]
};

export default AuthenticationRoutes;
