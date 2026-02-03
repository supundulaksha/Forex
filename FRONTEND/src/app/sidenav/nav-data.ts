import { INavbarData } from './helper';

export const navbarData: INavbarData[] = [
  {
    routerLink: 'dashboard',
    icon: 'fas fa-tachometer-alt',
    label: 'Dashboard',
  },
  {
    routerLink: '',
    icon: 'fas fa-database',
    label: 'Master',
    items: [
      {
        routerLink: 'title',
        label: 'Title',
      },
      {
        routerLink: 'menu-types',
        label: 'Menu Types',
      },
      {
        routerLink: 'reservation-types',
        label: 'Reservation Types',
      },
      {
        routerLink: 'tables',
        label: 'Tables',
      },
      {
        routerLink: 'menu-items',
        label: 'Menu Items',
      },
      {
        routerLink: 'chef-master',
        label: 'Chef Master',
      },
    ],
  },
  {
    routerLink: '',
    icon: 'fas fa-users',
    label: 'Customer',
    items: [
      {
        routerLink: 'customer-form',
        label: 'Customer Form',
      }
    ],
  },
  {
    routerLink: '',
    icon: 'fas fa-utensils',
    label: 'Kitchen',
    items: [
      {
        routerLink: 'kitchen-dashboard',
        label: 'Kitchen Dashboard',
      },
      {
        routerLink: 'orders',
        label: 'Orders',
      }
    ],
  }
];
