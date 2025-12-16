export interface Booking {
  id: string;
  resource: string;
  time: string;
  status: 'active' | 'pending' | 'approved' | 'cancelled' | 'completed';
  payment: 'paid' | 'unpaid';
  client: string;
}

export interface DashboardStats {
  todayBookings: number;
  occupancy: number;
  revenue: string;
}

export interface Resident {
  name: string;
  status: 'active' | 'inactive';
  tariff: string;
}

export const mockBookings: Booking[] = [
  {
    id: 'XJ-2501',
    resource: 'Место A-12',
    time: '10:00-12:00',
    status: 'active',
    payment: 'paid',
    client: 'Иван П.'
  },
  {
    id: 'XJ-2502',
    resource: 'Переговорная',
    time: '14:00-15:00',
    status: 'pending',
    payment: 'unpaid',
    client: 'Мария С.'
  },
  {
    id: 'XJ-2503',
    resource: 'Место B-05',
    time: '09:00-11:00',
    status: 'approved',
    payment: 'paid',
    client: 'Алексей К.'
  },
  {
    id: 'XJ-2504',
    resource: 'Лекторий',
    time: '16:00-17:30',
    status: 'completed',
    payment: 'paid',
    client: 'ООО "Технологии"'
  }
];

export const mockStats: DashboardStats = {
  todayBookings: 24,
  occupancy: 78,
  revenue: '₽45,000'
};

export const mockResidents: Resident[] = [
  { name: 'Иван П.', status: 'active', tariff: 'Hot desk' },
  { name: 'Мария С.', status: 'active', tariff: 'Фикс место' }
];

export const mockOccupancyData = [
  { hour: '08:00', value: 20 },
  { hour: '09:00', value: 45 },
  { hour: '10:00', value: 70 },
  { hour: '11:00', value: 85 },
  { hour: '12:00', value: 90 },
  { hour: '13:00', value: 75 },
  { hour: '14:00', value: 80 },
  { hour: '15:00', value: 85 },
  { hour: '16:00', value: 70 },
  { hour: '17:00', value: 60 },
  { hour: '18:00', value: 40 },
  { hour: '19:00', value: 25 }
];
