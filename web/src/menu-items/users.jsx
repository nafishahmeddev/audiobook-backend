// assets
import { IconUsers } from '@tabler/icons';

// constant
const icons = {
  IconUsers
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const users = {
  id: 'users',
  title: 'Users',
  caption: 'haaki users',
  type: 'group',
  children: [
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
          target: true
        },
        {
          id: 'cms_users',
          title: 'CMS Users',
          type: 'item',
          url: '',
          target: true
        }
      ]
    }
  ]
};

export default users;
