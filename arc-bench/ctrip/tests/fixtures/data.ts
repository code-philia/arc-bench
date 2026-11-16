export const SMS_CODE = "123456";

// Sample accounts and ownership described by REQ-1, REQ-4, REQ-6 and REQ-8,
// and provided by impl/ctrip. Registration supplies new accounts instead.
const demoPassword = 'Travel1234';
export const ACCOUNTS = {
  user: { username: 'ctrip_user', email: 'ctrip_user@example.com', mobile: '13800000013', password: demoPassword },
  voucher_completed: { username: 'voucher_completed', password: demoPassword },
  voucher_pending: { username: 'voucher_pending', password: demoPassword },
  voucher_older: { username: 'voucher_older', password: demoPassword },
} as const;

// Stable numbers identify historical records. Booking and status dates roll independently of these identifiers.
export const ORDERS = {
  pending: { number: 'CTRIP20260721001', flight: 'JD5162', total: 530, status: 'Pending payment' },
  upcoming: { number: 'CTRIP20260722002', flight: 'CZ3401', total: 390, status: 'Not traveled' },
  review: { number: 'CTRIP20260718003', flight: 'MU5234', total: 650, status: 'Pending review' },
} as const;

export const VOUCHERS = {
  completed: 'CTRIP20260718004',
  recent: 'CTRIP20260721005',
  older: 'CTRIP20260514001',
} as const;

export const CHENGDU_GUANGZHOU_FLIGHTS = [
  { number: 'CZ3401', fare: '¥320', departure: '11:00', punctuality: '95%' },
  { number: 'JD5162', fare: '¥460', departure: '09:00', punctuality: '88%' },
  { number: 'MU5234', fare: '¥580', departure: '07:30', punctuality: '91%' },
] as const;
