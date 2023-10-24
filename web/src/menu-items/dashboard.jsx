// assets
import { IconDashboard, IconBooks, IconKey, IconBrandDouban, IconUsers, IconCreditCard } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconKey, IconBooks, IconBrandDouban, IconUsers, IconCreditCard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'publisher',
      title: 'Publisher',
      type: 'item',
      url: '/publishers',
      icon: icons.IconBrandDouban,
      breadcrumbs: false
    },
    {
      id: 'books',
      title: 'Books',
      type: 'item',
      url: '/books',
      icon: icons.IconBooks,
      breadcrumbs: false
    },
    {
      id: 'users',
      title: 'Users',
      type: 'collapse',
      icon: icons.IconUsers,
      children: [
        {
          id: 'app_users',
          title: 'App Users',
          type: 'item',
          url: '',
        },
        {
          id: 'cms_users',
          title: 'CMS Users',
          type: 'item',
          url: '',
        }
      ]
    },
    {
      id: 'payment',
      title: 'Payment',
      type: 'collapse',
      icon: icons.IconCreditCard,
      children: [
        {
          id: 'inbound',
          title: 'Inbound payment',
          type: 'item',
          url: '',
          target: true
        },
        {
          id: 'outbound',
          title: 'Outbound payment',
          type: 'item',
          url: '',
          target: true
        }
      ]
    }
  ]
};

export default dashboard;
