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
          id: 'unit_templates',
          title: 'Unit Templates',
          type: 'item',
          url: '/settings/unit-templates'
        },
        {
          id: 'provision_templates',
          title: 'Provision Templates',
          type: 'item',
          url: '/settings/provision-templates',
          target: false
        },
        {
          id: 'speakers',
          title: 'Speakers',
          type: 'item',
          url: '/settings/speakers',
          target: false
        },
        {
          id: 'authors',
          title: 'Authors',
          type: 'item',
          url: '/settings/authors',
          target: false
        },
        {
          id: 'countries',
          title: 'Countries',
          type: 'item',
          url: '/settings/countries'
        },
        {
          id: 'categories',
          title: 'Categories',
          type: 'item',
          url: '/settings/categories',
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
        {
          id: 'banners',
          title: 'Banners',
          type: 'item',
          url: '/settings/banners',
          target: false
        },
        {
          id: 'tags',
          title: 'Tags',
          type: 'item',
          url: '/settings/tags',
          target: false
        },
        {
          id: 'memberships',
          title: 'Memberships',
          type: 'item',
          url: '/settings/memberships',
          target: false
        },
        {
          id: 'currencies',
          title: 'Currencies',
          type: 'item',
          url: '/settings/currencies'
        },
        {
          id: 'change_password',
          title: 'Change Password',
          type: 'item',
          url: '/settings/change-password',
          target: false
        }
      ]
    }
  ]
};

export default settings;
