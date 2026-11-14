import { test as base, expect, type Page, type Locator } from '@playwright/test';
import { action, checkbox, dayAction, field, flightEntry, flightIdentity, flights, radio, record, records, region, selectChoice, setChecked } from './ui';
import { accountInput, newMobile, travelerInput, addressInput, contactInput, invoiceInput } from './fixtures/inputs';
import { ACCOUNTS, SMS_CODE, ORDERS, VOUCHERS } from './fixtures/data';
import { tripDate } from './fixtures/dates';
export { ACCOUNTS, SMS_CODE, ORDERS, VOUCHERS, tripDate };
export const test = base.extend({ timezoneId: 'Asia/Shanghai' });
export { action, action as button, checkbox, dayAction, expectChoice, expectDateField, expectFieldValue, field, radio, record, records, recordCheckbox, region, selectChoice, setChecked, timer } from './ui';
export { accountInput, newMobile, passwordInput, profileInput, uniqueName, travelerInput, addressInput, contactInput, invoiceInput } from './fixtures/inputs';
const button = action;
type Scope = Page | Locator;
const named = (name: string) => ({ name, exact: true });
export const dialog = (s: Scope, name: string) => s.getByRole('dialog', named(name))
  .or(s.getByRole('dialog').filter({ has: ('page' in s ? s.page() : s).getByRole('heading', named(name)) }));
export const tab = (s: Scope, name: string) => s.getByRole('tab', named(name)).or(action(s, name));
export const selectedTab = (s: Scope, name: string) => s.getByRole('tab', { ...named(name), selected: true })
  .or(action(s, name).and(s.locator('[aria-current="page"], [aria-current="true"], [aria-pressed="true"]')));
export const nav = (page: Page) => page.getByRole('navigation', named('Global navigation'))
  .or(page.getByRole('banner').getByRole('navigation'))
  .or(page.getByRole('banner').filter({ hasNot: page.getByRole('navigation') }));
export const flightRows = (page: Page) => flights(region(page, 'Flight list'));
export const flight = (page: Page, number: string) => flightEntry(region(page, 'Flight list'), number);
export const visible = async (l: Locator) => { await expect(l).toBeVisible(); };
export const heading = async (page: Page, name: string) => visible(page.getByRole('heading', { name, exact: true }));
export const textVisible = async (s: Scope, text: string) => {
  // Text may repeat within a record (for example route city and bus stop).
  // Presence is scoped to the semantic region and only visible copies count.
  const matches = s.getByText(text, { exact: true }).filter({ visible: true });
  await expect.poll(() => matches.count()).toBeGreaterThan(0);
  for (const match of await matches.all()) await expect(match).toBeVisible();
};
export const alertText = async (s: Scope, text: string) => { await expect(s.getByText(text, { exact: true }).filter({ visible: true })).toBeVisible(); };
export const searchBox = (s: Scope) => s.getByRole('searchbox')
  .or(s.getByRole('search').getByRole('textbox'));
export const total = async (page: Page, n: number) => textVisible(region(page, 'Fee breakdown'), `Order total: ¥${n}`);
export async function openHome(page: Page) {
  tripDate(page, 0);
  await page.goto('/');
}
export async function openLogin(page: Page) { await action(nav(page), 'Log in').click(); }
export const passwordField = (page: Page) => field(page, 'Password').filter({ visible: true });
export const loginSubmit = (page: Page) => action(page, 'Log in').and(
  page.locator('form *, [role="form"] *, :not(header *, nav *, [role="navigation"] *)'),
).filter({ visible: true });
export async function login(page: Page, account: string, password: string, openForm = true) {
  if (openForm) await openLogin(page);
  await field(page, 'Account').fill(account);
  await passwordField(page).fill(password);
  await setChecked(checkbox(page, 'Agree to terms'));
  await loginSubmit(page).click();
  await visible(action(nav(page), 'My account'));
}
export async function loginOwner(page: Page, owner: string) {
  const a = ACCOUNTS[owner];
  if (!a?.email || !a.password) throw new Error(`No password-login fixture for ${owner}`);
  await login(page, a.email, a.password);
}
export async function smsLoginForm(page: Page) { await openLogin(page); await action(page, 'Verification code login').click(); }
export async function signedOut(page: Page) {
  await visible(action(nav(page), 'Log in'));
  await expect(action(page, 'My account')).toHaveCount(0);
}
export async function registerToPassword(page: Page, phone: string) {
  await action(nav(page), 'Register').click();
  await button(dialog(page, 'Registration agreement and privacy policy'), 'Agree and continue').click();
  await field(page, 'Mobile number').fill(phone);
  await button(page, 'Send code').click();
  await visible(action(page, 'Resend code'));
  await field(page, 'Verification code').fill(SMS_CODE);
  await button(page, 'Next, set password').click();
}
export async function createMobileAccount(page: Page) {
  const account = accountInput();
  await registerToPassword(page, account.mobile);
  await passwordField(page).fill(account.password);
  await field(page, 'Confirm password').fill(account.password);
  await button(page, 'Complete registration').click();
  await heading(page, 'Log in');
  return account;
}
export async function registerAccount(page: Page) {
  const account = await createMobileAccount(page);
  await login(page, account.mobile, account.password, false);
  return account;
}
export async function chooseDate(page: Page, label: string, date: string) { await field(page, label).click(); await dayAction(page, date).click(); }
export async function searchFlights(page: Page, origin = 'Chengdu', destination = 'Guangzhou', date = tripDate(page, 2)) {
  await field(page, 'Origin').fill(origin);
  await field(page, 'Destination').fill(destination);
  await chooseDate(page, 'Departure date', date);
  await button(page, 'Search flights').click();
  await visible(region(page, 'Flight list'));
}
export async function flightOrder(page: Page) {
  return Promise.all((await flightRows(page).all()).map(flightIdentity));
}
export async function openBooking(page: Page) {
  await searchFlights(page);
  await button(flight(page, 'JD5162'), 'Show fares').click();
  await button(region(flight(page, 'JD5162'), 'Economy fare'), 'Book').click();
  await heading(page, 'Book flight');
}
export async function submitBooking(page: Page) {
  const traveler = travelerInput('Passenger');
  await field(region(page, 'Passenger details'), 'Full name').fill(traveler.name);
  await field(region(page, 'Passenger details'), 'ID number').fill(traveler.id);
  await field(page, 'Contact mobile').fill(newMobile());
  await setChecked(checkbox(page, 'Agree to booking terms'));
  await button(page, 'Submit order').click();
}
export async function openOrders(page: Page, owner?: string) {
  if (owner) await loginOwner(page, owner);
  await accountDestination(page, 'Orders');
}
export async function bookUnpaidOrder(page: Page) {
  await registerAccount(page);
  await openBooking(page);
  await submitBooking(page);
  await heading(page, 'Payment');
  await openHome(page);
  await openOrders(page);
  const orders = region(page, 'Order list');
  const rows = records(orders);
  await expect(rows).toHaveCount(1);
  const number = await orderNumber(rows);
  const row = orderRecord(orders, number);
  await textVisible(row, 'JD5162');
  await button(row, 'View details').click();
  await textVisible(region(page, 'Payment status'), 'Pending payment');
  return number;
}
const orderNumberLabel = /^Order (?:number|no\.?)\s*:\s*\S+$/i;
export const orderRecord = (scope: Scope, number: string) => {
  const page = 'page' in scope ? scope.page() : scope;
  const escaped = number.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const label = new RegExp(`^Order (?:number|no\\.?)\\s*:\\s*${escaped}$`, 'i');
  return record(scope, number).or(records(scope).filter({ has: page.getByText(label) }));
};

export async function orderNumber(scope: Scope) {
  const value = scope.getByText(orderNumberLabel).or(scope.getByText(/^CTRIP\d+$/));
  await expect(value).toBeVisible();
  return (await value.innerText()).replace(/^Order (?:number|no\.?)\s*:\s*/i, '').trim();
}
export async function accountDestination(page: Page, name: string) {
  await action(nav(page), 'My account').click();
  await action(page, name).click();
}
export async function openPersonal(page: Page, owner?: string) {
  if (owner) await loginOwner(page, owner);
  await accountDestination(page, 'Personal center');
}
export async function editProfile(page: Page, profile: { nickname: string; name: string; gender: string; birthDate: string }) {
  await action(page, 'My information').click();
  await button(page, 'Edit').click();
  await field(page, 'Nickname').fill(profile.nickname);
  await field(page, 'Real name').fill(profile.name);
  await selectChoice(page, 'Gender', profile.gender);
  await field(page, 'Date of birth').fill(profile.birthDate);
  await button(page, 'Save').click();
}
export async function openCommon(page: Page, owner: string | undefined, name: string) {
  await openPersonal(page, owner);
  await button(page, 'Common information').click();
  await action(page, name).click();
}
export async function createTraveler(page: Page, traveler: ReturnType<typeof travelerInput>) {
  await button(page, 'Add traveler').click();
  const form = region(page, 'Add traveler');
  await field(form, 'Full name').fill(traveler.name);
  await field(form, 'ID number').fill(traveler.id);
  await button(form, 'Save traveler').click();
  await visible(record(region(page, 'Traveler list'), traveler.name));
}
export async function createAddress(page: Page, address: ReturnType<typeof addressInput>) {
  await button(page, 'Add address').click();
  const form = region(page, 'Add address');
  for (const [key, value] of [
    ['Recipient', address.name], ['City', address.city], ['District', address.district],
    ['Street address', address.street], ['Mobile number', address.mobile],
  ]) await field(form, key).fill(value);
  await button(form, 'Save address').click();
  await visible(record(region(page, 'Address list'), address.name));
}
export async function createContact(page: Page, contact: ReturnType<typeof contactInput>) {
  await button(page, 'Add contact').click();
  const form = region(page, 'Add contact');
  for (const [key, value] of [['Contact name', contact.name], ['Mobile number', contact.mobile], ['Email', contact.email]]) {
    await field(form, key).fill(value);
  }
  await setChecked(checkbox(form, 'Default contact'), contact.isDefault);
  await button(form, 'Save contact').click();
  await visible(record(region(page, 'Contact list'), contact.name));
}
export async function createInvoice(page: Page, invoice: ReturnType<typeof invoiceInput>) {
  await button(page, 'Add invoice title').click();
  const form = region(page, 'Add invoice title');
  await selectChoice(form, 'Type', 'Company');
  await field(form, 'Invoice title').fill(invoice.name);
  await field(form, 'Taxpayer ID').fill(invoice.taxId);
  await button(form, 'Save').click();
  await visible(record(region(page, 'Invoice title list'), invoice.name));
}
export async function openSecurity(page: Page, owner?: string) {
  await openPersonal(page, owner);
  await action(page, 'Account security').click();
}
export async function openStatus(page: Page) { await action(page, 'Flights').click(); await action(page, 'Flight status').click(); }
export async function queryStatusNumber(page: Page, number: string) { await setChecked(radio(page, 'Flight number')); await field(page, 'Flight number').fill(number); await field(page, 'Departure date').fill(tripDate(page, 2)); await button(page, 'Search').click(); await visible(region(page, 'Flight details')); }
export async function openVouchers(page: Page, owner?: string) {
  if (owner) await loginOwner(page, owner);
  await action(page, 'More services').click();
  await action(page, 'Reimbursement vouchers').click();
}
export async function openAirport(page: Page) { await action(page, 'Flights').click(); await action(page, 'More services').click(); await action(page, 'Airport guide').click(); }
export async function openAirportDetails(page: Page) { await openAirport(page); await action(region(page, 'Popular airports'), 'Beijing Capital Airport').click(); }

export async function countdownSeconds(timer: Locator) {
  const text = (await timer.innerText()).trim();
  const match = text.match(/^(?:Time remaining\s*:?\s+)?(\d{1,3}):([0-5]\d)(?::([0-5]\d))?$/i);
  if (!match) throw new Error(`Time remaining must render a duration: ${text}`);
  return match[3] ? Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3])
    : Number(match[1]) * 60 + Number(match[2]);
}
