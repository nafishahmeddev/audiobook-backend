import { lazy } from 'react';

// project imports
import MainLayout from '../layout/MainLayout';
import Loadable from '@app/themes/ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../pages/dashboard')));

//settings page routing
const CountriesPage = Loadable(lazy(() => import('../pages/settings/countries/CountryPage')));
const CurrenciesPage = Loadable(lazy(() => import('../pages/settings/currencies/CurrencyPage')));
const UnitTemplatePage = Loadable(lazy(() => import('../pages/settings/unit-templates/UnitTemplatePage')));
const ProvisionTemplatePage = Loadable(lazy(() => import('../pages/settings/provision-templates/ProvisionTemplatePage')));
const SpeakerPage = Loadable(lazy(() => import('../pages/settings/speakers/SpeakerPage')));
const AuthorPage = Loadable(lazy(() => import('../pages/settings/authors/AuthorPage')));
const CategoryPage = Loadable(lazy(() => import('../pages/settings/categories/CategoryPage')));
const ListPage = Loadable(lazy(() => import('../pages/settings/lists/ListPage')));
const GenrePage = Loadable(lazy(() => import('../pages/settings/genres/GenrePage')));
const BannerPage = Loadable(lazy(() => import('../pages/settings/banners/BannerPage')));
const TagPage = Loadable(lazy(() => import('../pages/settings/tags/TagPage')));
const MembershipPage = Loadable(lazy(() => import('../pages/settings/memberships/MembershipPage')));
const ChangePasswordPage = Loadable(lazy(() => import('../pages/settings/change-password/ChangePasswordPage')));

// ==============================|| MAIN ROUTING ||============================== //

const SettingsRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'settings/unit-templates',
      element: <UnitTemplatePage />
    },
    {
      path: 'settings/countries',
      element: <CountriesPage />
    },
    {
      path: 'settings/currencies',
      element: <CurrenciesPage />
    },
    {
      path: 'settings/provision-templates',
      element: <ProvisionTemplatePage />
    },
    {
      path: 'settings/speakers',
      element: <SpeakerPage />
    },
    {
      path: 'settings/authors',
      element: <AuthorPage />
    },
    {
      path: 'settings/categories',
      element: <CategoryPage />
    },
    {
      path: 'settings/lists',
      element: <ListPage />
    },
    {
      path: 'settings/memberships',
      element: <MembershipPage />
    },
    {
      path: 'settings/genres',
      element: <GenrePage />
    },
    {
      path: 'settings/banners',
      element: <BannerPage />
    },
    {
      path: 'settings/tags',
      element: <TagPage />
    },
    {
      path: 'settings/change-password',
      element: <ChangePasswordPage />
    }
  ]
};

export default SettingsRoutes;
