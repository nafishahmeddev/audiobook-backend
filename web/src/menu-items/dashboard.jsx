// assets
import {
  IconDashboard,
  IconBooks,
  IconKey,
  IconBrandDouban,
  IconUsers,
  IconCreditCard
} from '@tabler/icons';

// constant
const icons = {
  IconDashboard,
  IconKey,
  IconBooks,
  IconBrandDouban,
  IconUsers,
  IconCreditCard
};

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
      id: 'albums',
      title: 'Albums',
      type: 'item',
      url: '/albums',
      icon: icons.IconBooks,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
