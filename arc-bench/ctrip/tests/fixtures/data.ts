// Credentials for system-provided accounts that already have verified identifiers or historical data.
export const SMS_CODE = "123456";
export const ACCOUNTS: Record<string, { email: string; password: string; mobile?: string; username?: string }> = {
  "user": {
    "email": "ctrip_user@example.com",
    "password": "Travel1234",
    "username": "ctrip_user"
  },
  "order_read": {
    "email": "ctrip_order_read@example.com",
    "password": "Travel1234"
  },
  "profile_read": {
    "email": "ctrip_profile_read@example.com",
    "password": "Travel1234",
    "mobile": "13800000013"
  },
  "email_binding": {
    "email": "ctrip_email_binding@example.com",
    "password": "Travel1234"
  },
  "voucher_read": {
    "email": "ctrip_voucher_read@example.com",
    "password": "Travel1234"
  },
  "voucher_pending": {
    "email": "ctrip_voucher_pending@example.com",
    "password": "Travel1234"
  },
  "voucher_history": {
    "email": "ctrip_voucher_history@example.com",
    "password": "Travel1234"
  }
};

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
