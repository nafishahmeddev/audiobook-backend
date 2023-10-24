// assets
import { IconSettings } from '@tabler/icons';

// constant
const icons = {
  IconSettings
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const settings = {
  id: 'settings',
  title: 'Settings',
  caption: 'Settings',
  type: 'group',
  children: [
    {
      id: 'settings',
      title: 'Settings',
      type: 'collapse',
      icon: icons.IconSettings,
      children: [
        {
          id: 'authors',
          title: 'Authors',
          type: 'item',
          url: '/settings/authors',
          target: false
        },
        {
          id: 'list',
          title: 'List',
          type: 'item',
          url: '/settings/lists',
          target: false
        },
        {
          id: 'genres',
          title: 'Genres',
          type: 'item',
          url: '/settings/genres',
          target: false
        },
      ]
    }
  ]
};

export default settings;
