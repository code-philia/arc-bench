// requirement: REQ-1.3
import { test, expect } from "@playwright/test";
import { field, button, action, checkbox, nav, visible, heading, alertText, openHome, installClock, openLogin, login } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-1.3: Authenticate by email', async ({ page }, testInfo) => {
  await openHome(page);
  await login(page, 'ctrip_user@example.com');
  await heading(page, 'Ctrip Travel');
  await visible(action(page, 'My account'));
  await expect(nav(page).getByRole('link', { name: 'Log in', exact: true })).toHaveCount(0);
});

test('REQ-1.3: Authenticate by username', async ({ page }, testInfo) => {
  await openHome(page);
  await login(page, 'ctrip_user');
  await heading(page, 'Ctrip Travel');
  await visible(action(page, 'My account'));
  await expect(nav(page).getByRole('link', { name: 'Log in', exact: true })).toHaveCount(0);
});

test('REQ-1.3: Authenticate by mobile', async ({ page }, testInfo) => {
  await openHome(page);
  await login(page, '13800000010');
  await heading(page, 'Ctrip Travel');
  await visible(action(page, 'My account'));
  await expect(nav(page).getByRole('link', { name: 'Log in', exact: true })).toHaveCount(0);
});

test('REQ-1.3: Reject missing account', async ({ page }, testInfo) => {
  await openHome(page);
  await openLogin(page);
  await expect(checkbox(page, 'Agree to terms')).not.toBeChecked();
  await field(page, 'Account').fill('');
  await field(page, 'Password').fill('Travel1234');
  await checkbox(page, 'Agree to terms').check();
  await button(page, 'Log in').click();
  await alertText(page, 'Enter your account');
  await visible(field(page, 'Account'));
  await expect(action(page, 'My account')).toHaveCount(0);
});

test('REQ-1.3: Reject missing password', async ({ page }, testInfo) => {
  await openHome(page);
  await openLogin(page);
  await expect(checkbox(page, 'Agree to terms')).not.toBeChecked();
  await field(page, 'Account').fill('ctrip_user@example.com');
  await field(page, 'Password').fill('');
  await checkbox(page, 'Agree to terms').check();
  await button(page, 'Log in').click();
  await alertText(page, 'Enter your password');
  await visible(field(page, 'Account'));
  await expect(action(page, 'My account')).toHaveCount(0);
});

test('REQ-1.3: Reject incorrect password', async ({ page }, testInfo) => {
  await openHome(page);
  await openLogin(page);
  await expect(checkbox(page, 'Agree to terms')).not.toBeChecked();
  await field(page, 'Account').fill('ctrip_user@example.com');
  await field(page, 'Password').fill('WrongPass123');
  await checkbox(page, 'Agree to terms').check();
  await button(page, 'Log in').click();
  await alertText(page, 'Incorrect account or password');
  await visible(field(page, 'Account'));
  await expect(action(page, 'My account')).toHaveCount(0);
});

test('REQ-1.3: Require legal acceptance', async ({ page }, testInfo) => {
  await openHome(page);
  await openLogin(page);
  await expect(checkbox(page, 'Agree to terms')).not.toBeChecked();
  await field(page, 'Account').fill('ctrip_user@example.com');
  await field(page, 'Password').fill('Travel1234');
  await button(page, 'Log in').click();
  await alertText(page, 'Agree to terms first');
  await visible(field(page, 'Account'));
  await expect(action(page, 'My account')).toHaveCount(0);
});

