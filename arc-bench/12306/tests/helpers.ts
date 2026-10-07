import { expect, type Page, type Locator } from '@playwright/test';
export { PASS, trains, plans } from './fixtures/data';
import { PASS, trains, plans } from './fixtures/data';
type Surface = Page | Locator;
export const AGREEMENT = 'I have read and agree to abide by Terms of Service and Privacy Policy of 12306.cn.';
export const link = (s: Surface, name: string) => s.getByRole('link', { name, exact: true });
export const button = (s: Surface, name: string) => s.getByRole('button', { name, exact: true });
export const field = (s: Surface, name: string) => s.getByLabel(name, { exact: true });
export const region = (s: Surface, name: string) => s.getByRole('region', { name, exact: true });
// Public row identity, independent of CSS, column order, and nesting.
export const row = (s: Surface, identity: string) => s.getByRole('row').filter({ has: ('page' in s ? s.page() : s).getByText(identity, { exact: true }) });
export async function text(page: Page, value: string, exact = true) { await expect(page.getByText(value, { exact })).toBeVisible(); }
export async function entry(page: Page) { await page.goto('/'); }
export async function home(page: Page) { await link(page.getByRole('navigation').filter({ has: link(page, 'Home') }), 'Home').click(); }
export async function login(page: Page, user = 'registered_user', password: string = PASS, success = true) {
    await link(page, 'Login').click();
    await page.getByPlaceholder('Email/Username/Mobile number', { exact: true }).fill(user);
    await page.getByPlaceholder('Password', { exact: true }).fill(password);
    await button(page, 'LOGIN').click();
    if (success)
        await expect(link(page, 'Sign Out')).toBeVisible();
}
export async function register(page: Page, options: Record<string, string | boolean> = {}) {
    await link(page, 'Register').click();
    await expect(field(page, 'Nationality').getByRole('option', { name: 'Please select', exact: true, selected: true })).toHaveCount(1);
    await field(page, 'Nationality').selectOption({ label: 'China' });
    const defaults: Record<string, string> = { 'Name': 'Test Traveler', 'Passport number': 'P20260001', 'Passport expiration date': '2026-12-31', 'Date of birth': '1996-06-18', 'Username': 'traveler_new', 'Password': PASS, 'Confirm Password': PASS, 'Email address': 'traveler_new@example.com' };
    if (typeof options.username === 'string' && options.email === undefined)
        defaults['Email address'] = options.username + '@example.com';
    const aliases: Record<string, string> = { name: 'Name', passport: 'Passport number', username: 'Username', password: 'Password', confirm: 'Confirm Password', email: 'Email address' };
    for (const [key, value] of Object.entries(options))
        if (aliases[key])
            defaults[aliases[key]] = String(value);
    for (const [label, value] of Object.entries(defaults))
        await field(page, label).fill(value);
    await page.getByRole('radio', { name: 'Male', exact: true }).check();
    if (options.agree !== false)
        await page.getByRole('checkbox', { name: AGREEMENT, exact: true }).check();
    await button(page, 'Register').click();
}
export async function center(page: Page) { await home(page); await link(page, 'My 12306').click(); await expect(page.getByRole('navigation', { name: 'Personal center menu', exact: true })).toBeVisible(); }
export async function section(page: Page, parent: string, child: string) {
    await center(page);
    const menu = page.getByRole('navigation', { name: 'Personal center menu', exact: true });
    await link(menu, parent).click();
    await link(menu, child).click();
}
export async function orders(page: Page, tab: string) { await section(page, 'Order center', 'Ticket orders'); await page.getByRole('tab', { name: tab, exact: true }).click(); await expect(page.getByRole('tab', { name: tab, exact: true })).toHaveAttribute('aria-selected', 'true'); }
export async function search(page: Page, from = 'Shanghai', to = 'Beijing', date = '2026-07-21', omit = '') {
    const places: Record<string, [
        string,
        string
    ]> = { Shanghai: ['shang', 'Shanghai (上海)'], Beijing: ['bei', 'Beijing (北京)'], Yancheng: ['yan', 'Yancheng (盐城)'], Lhasa: ['lhasa', 'Lhasa (拉萨)'] };
    for (const [label, value] of [['From', from], ['To', to]]) {
        const input = page.getByPlaceholder(label, { exact: true });
        if (omit === label) {
            await input.fill('');
            continue;
        }
        await input.fill(places[value][0]);
        await button(page, places[value][1]).click();
    }
    await field(page, 'Date').click();
    await button(page, date).click();
    await button(page, 'Search').click();
    if (!omit)
        await expect(field(page, 'Date')).toHaveValue(date);
}
export async function defaultResults(page: Page) {
    await expect(page.getByPlaceholder('From', { exact: true })).toHaveValue('Beijing');
    await expect(page.getByPlaceholder('To', { exact: true })).toHaveValue('Shanghai');
    await expect(field(page, 'Date')).toHaveValue('2026-07-21');
    await expect(row(page, 'G3001')).toBeVisible();
}
export async function checkHeaders(s: Surface, names: string[]) {
    for (const name of names)
        await expect(s.getByRole('columnheader', { name, exact: true })).toBeVisible();
}
export async function trainIds(page: Page) {
    const rows = await page.getByRole('row').filter({ has: button(page, 'Book') }).all();
    const result: string[] = [];
    for (const r of rows) {
        const cells = await r.getByRole('cell').allTextContents();
        const ids = cells.flatMap(s => s.match(/\b[GCDKZT]\d+\b/g) ?? []);
        if (ids.length !== 1)
            throw new Error('Train result needs one identifiable train number in its cells');
        result.push(ids[0]);
    }
    return result;
}
export async function expectTrainIds(page: Page, ids: string[]) { await expect.poll(async () => (await trainIds(page)).sort()).toEqual([...ids].sort()); }
export async function sortTrains(page: Page, label: string, key: 'departure' | 'duration' | 'arrival') {
    const ordered = [...trains].sort((a, b) => String(a[key]).localeCompare(String(b[key]), 'en', { numeric: true })).map(t => t.number);
    await button(page.getByRole('columnheader', { name: label, exact: true }), label).click();
    await expect.poll(() => trainIds(page)).toEqual(ordered);
    await button(page.getByRole('columnheader', { name: label, exact: true }), label).click();
    await expect.poll(() => trainIds(page)).toEqual([...ordered].reverse());
}
export async function planIds(page: Page) {
    const articles = await region(page, 'Transfer plans').getByRole('article').all();
    const result: string[] = [];
    for (const article of articles) {
        const number = article.getByText(/^D\d+$/, { exact: true });
        await expect(number).toHaveCount(1);
        result.push((await number.innerText()).trim());
    }
    return result;
}
export async function sortPlans(page: Page, label: string, key: 'departure' | 'total' | 'arrival') {
    const ordered = [...plans].sort((a, b) => String(a[key]).localeCompare(String(b[key]), 'en', { numeric: true })).map(p => p.first);
    await button(region(page, 'Transfer plans'), label).click();
    await expect.poll(() => planIds(page)).toEqual(ordered);
    await button(region(page, 'Transfer plans'), label).click();
    await expect.poll(() => planIds(page)).toEqual([...ordered].reverse());
}
export async function passengerPage(page: Page) { await section(page, 'Information management', 'My Passengers'); }
export async function addPassenger(page: Page, name: string, passport: string, options: Record<string, string> = {}, success = true) {
    await button(page, 'Add new passengers').click();
    const d = page.getByRole('dialog', { name: 'Add new passengers', exact: true });
    await field(d, 'Nationality').selectOption({ label: 'China' });
    const values: Record<string, string> = { 'Name': name, 'Passport number': passport, 'Passport expiration date': options.expiration ?? (name === 'Passenger Example' ? '2027-12-31' : '2028-12-31'), 'Date of birth': options.birth ?? (name === 'Passenger Example' ? '2000-01-15' : '1999-02-20'), 'Email address': options.email ?? (name === 'Passenger Example' ? 'passenger@example.com' : 'added.passenger@example.com'), 'Mobile number': options.mobile ?? (name === 'Passenger Example' ? '13800000040' : '13800000043') };
    for (const [label, value] of Object.entries(values))
        await field(d, label).fill(value);
    await d.getByRole('radio', { name: options.gender ?? (name === 'Passenger Example' ? 'Female' : 'Male'), exact: true }).check();
    await field(d, 'Passenger type').selectOption({ label: 'Adult' });
    await button(d, 'Determine').click();
    if (success) {
        await expect(d).not.toBeVisible();
        await expect(row(page, passport)).toBeVisible();
    }
}
export async function manager(page: Page) { await login(page, 'passenger_manager_user'); await passengerPage(page); await addPassenger(page, 'Passenger Example', 'P20269999'); }
const passports: Record<string, string> = { bookable_user: 'P20269997', booking_submit_user: 'P20269998', booking_confirm_user: 'P20269991', booking_edit_user: 'P20269992', booking_payment_user: 'P20269993', booking_cancel_user: 'P20269994', booking_paid_user: 'P20269995', booking_unpaid_user: 'P20269990', booking_upcoming_user: 'P20269989', booking_cancelled_user: 'P20269988' };
export async function booking(page: Page, user: string, existing = false, date = '2026-07-21', train = 'G1001') {
    if (!existing) {
        await login(page, user);
        await passengerPage(page);
        await addPassenger(page, 'Passenger Example', passports[user] ?? 'P20269801');
    }
    await home(page);
    await search(page, 'Shanghai', 'Beijing', date);
    await button(row(page, train), 'Book').click();
    await expect(page.getByRole('heading', { name: 'Train Information:', exact: true })).toBeVisible();
}
export async function confirmation(page: Page, user: string, existing = false, date = '2026-07-21', train = 'G1001') {
    await booking(page, user, existing, date, train);
    await page.getByRole('checkbox', { name: 'Passenger Example', exact: true }).check();
    const table = page.getByRole('table', { name: 'Booking passengers', exact: true });
    await field(row(table, passports[user] ?? 'P20269801'), 'Ticket class').selectOption({ label: 'Business-class seat' });
    await button(page, 'Place order').click();
    await expect(page.getByRole('dialog', { name: 'Please confirm the following information.', exact: true })).toBeVisible();
}
export async function payment(page: Page, user: string, date = '2026-07-21', train = 'G1001') {
    await confirmation(page, user, false, date, train);
    await button(page.getByRole('dialog', { name: 'Please confirm the following information.', exact: true }), 'Confirm').click();
    await expect(region(page, 'Order details')).toContainText(train);
}
export async function orderSetup(page: Page, user: string, date = '2026-07-21', paid = false, train = 'G1001') {
    await payment(page, user, date, train);
    if (paid) {
        await button(page, 'Pay').click();
        await text(page, 'Payment successful.');
    }
}
export async function fillDates(page: Page, start: string, end: string, keyword = '') {
    await field(page, 'Order date type').selectOption({ label: 'Search by departure date' });
    await field(page, 'Start date').fill(start);
    await field(page, 'End date').fill(end);
    await page.getByPlaceholder('Order number/train number/name', { exact: true }).fill(keyword);
    await button(page, 'Search').click();
}
export async function recover(page: Page, email: string, passport: string, success = true) {
    await link(page, 'Login').click();
    await link(page, 'Forgot password?').click();
    await field(page, 'Email:').fill(email);
    await field(page, 'ID number:').fill(passport);
    await button(page, 'submit').click();
    if (success)
        await expect(field(page, 'New password:')).toBeVisible();
}
export async function security(page: Page, kind: 'password' | 'mailbox') {
    await section(page, 'Personal', 'Account security');
    await expect(link(page, 'Login password')).toBeVisible();
    await expect(region(page, 'Security mailbox')).toBeVisible();
    await expect(region(page, 'Mobile number')).toBeVisible();
    if (kind === 'password')
        await link(page, 'Login password').click();
    else
        await button(region(page, 'Security mailbox'), 'Edit').click();
}
