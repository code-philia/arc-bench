import { randomInt, randomUUID } from 'node:crypto';
import { addDays, railwayToday } from './clock';

// System-provided accounts used for verified identity, historical records and
// the published seat allocations. See REQ-2.2, REQ-5.7, REQ-6 and REQ-8.
export const PASS = 'Password123!';
export const verifiedLogin = { username: 'registered_user', email: 'registered_user@example.com', mobile: '13800000010' };
export const verifiedProfile = { username: 'profile_user', mobile: '13800000030' };
export const history = { username: 'orders_history_user', train: 'G1001', departure: '2026-07-19' };
export const bookingAccounts = {
    inspect: 'bookable_user', submit: 'booking_submit_user', confirm: 'booking_confirm_user',
    edit: 'booking_edit_user', payment: 'booking_payment_user', paid: 'booking_paid_user',
    unpaid: 'booking_unpaid_user', cancel: 'booking_cancel_user',
    resume: 'orders_unpaid_user', upcoming: 'orders_upcoming_user', refund: 'orders_refund_user',
    cancelFromOrders: 'orders_cancel_center_user', dismissCancellation: 'orders_unpaid_dismiss_user',
} as const;
export type BookingAccount = typeof bookingAccounts[keyof typeof bookingAccounts];

export const uniqueInput = () => randomUUID().replaceAll('-', '').slice(0, 14);
export const newEmail = () => `rail_${uniqueInput()}@example.com`;
export const newMobile = () => `138${String(randomInt(100_000_000)).padStart(8, '0')}`;

export function newPassenger() {
    const letters = uniqueInput().replace(/\d/g, digit => String.fromCharCode(65 + Number(digit))).toUpperCase();
    return {
        name: `Rail Traveler ${letters}`,
        passport: `P${randomInt(10_000_000, 100_000_000)}`,
        expiration: addDays(railwayToday(), 730),
        birth: '1993-02-18',
        email: newEmail(),
        mobile: newMobile(),
        gender: 'Female',
    };
}

export type Passenger = ReturnType<typeof newPassenger>;

export function newAccount() {
    const passenger = newPassenger();
    const password = `Rail9!${uniqueInput().slice(0, 8)}`;
    return { ...passenger, gender: 'Male', username: `rail_${uniqueInput()}`, password, confirm: password, agree: true };
}

export type Account = ReturnType<typeof newAccount>;

// Published timetable and fares described in REQ-3, REQ-4 and REQ-8.2.
export const trains = [
    {
        "number": "G1001",
        "from_station": "Shanghai Hongqiao",
        "to_station": "Beijing South",
        "departure": "08:00",
        "arrival": "13:00",
        "duration": 300,
        "second_price": 576
    },
    {
        "number": "G1002",
        "from_station": "Shanghai",
        "to_station": "Beijing",
        "departure": "13:00",
        "arrival": "19:00",
        "duration": 360,
        "second_price": 600
    },
    {
        "number": "K1003",
        "from_station": "Shanghai",
        "to_station": "Beijing South",
        "departure": "00:30",
        "arrival": "15:30",
        "duration": 900,
        "second_price": 200
    }
] as const;
export const defaultTrain = 'G3001';
export const additionalTrain = 'G2002';
export const plans = [
    {
        "first": "D2001",
        "second": "Z21",
        "departure": "08:00",
        "arrival": "19:00",
        "wait": 60,
        "total": 2100,
        "via": "Beijing",
        "first_price": 200,
        "second_price": 400
    },
    {
        "first": "D2002",
        "second": "Z22",
        "departure": "06:00",
        "arrival": "16:00",
        "wait": 120,
        "total": 2040,
        "via": "Xian",
        "first_price": 180,
        "second_price": 420
    }
] as const;
