// assets
import { IconCreditCard } from '@tabler/icons';

// constant
const icons = {
  IconCreditCard
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const payment = {
  id: 'payment',
  title: 'Payment',
  caption: 'haaki payment',
  type: 'group',
  children: [
    {
      id: 'payment',
      title: 'Payment List',
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

export default payment;
