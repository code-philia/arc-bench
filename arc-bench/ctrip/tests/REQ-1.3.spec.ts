// requirement: REQ-1.3
import { expect } from "@playwright/test";
import { test, setChecked, field, action, checkbox, nav, visible, heading, alertText, openHome, openLogin, login, ACCOUNTS, loginSubmit, createMobileAccount, passwordField } from "./helpers";

test('REQ-1.3: Authenticate by email', async ({ page }) => {
  await openHome(page);
  await login(page, ACCOUNTS.user.email!, ACCOUNTS.user.password!);
  await heading(page, 'Ctrip Travel');
  await visible(action(page, 'My account'));
  await expect(action(nav(page), 'Log in')).toHaveCount(0);
});

test('REQ-1.3: Authenticate by username', async ({ page }) => {
  await openHome(page);
  await login(page, ACCOUNTS.user.username!, ACCOUNTS.user.password!);
  await heading(page, 'Ctrip Travel');
  await visible(action(page, 'My account'));
  await expect(action(nav(page), 'Log in')).toHaveCount(0);
});

test('REQ-1.3: Authenticate by mobile', async ({ page }) => {
  await openHome(page);
  const account = await createMobileAccount(page);
  await login(page, account.mobile, account.password, false);
  await heading(page, 'Ctrip Travel');
  await visible(action(page, 'My account'));
  await expect(action(nav(page), 'Log in')).toHaveCount(0);
});

test('REQ-1.3: Reject missing account', async ({ page }) => {
  await openHome(page);
  await openLogin(page);
  await expect(checkbox(page, 'Agree to terms')).not.toBeChecked();
  await field(page, 'Account').fill('');
  await passwordField(page).fill(ACCOUNTS.user.password!);
  await setChecked(checkbox(page, 'Agree to terms'));
  await loginSubmit(page).click();
  await alertText(page, 'Enter your account');
  await visible(field(page, 'Account'));
  await expect(action(page, 'My account')).toHaveCount(0);
});

test('REQ-1.3: Reject missing password', async ({ page }) => {
  await openHome(page);
  await openLogin(page);
  await expect(checkbox(page, 'Agree to terms')).not.toBeChecked();
  await field(page, 'Account').fill(ACCOUNTS.user.email!);
  await passwordField(page).fill('');
  await setChecked(checkbox(page, 'Agree to terms'));
  await loginSubmit(page).click();
  await alertText(page, 'Enter your password');
  await visible(field(page, 'Account'));
  await expect(action(page, 'My account')).toHaveCount(0);
});

test('REQ-1.3: Reject incorrect password', async ({ page }) => {
  await openHome(page);
  await openLogin(page);
  await expect(checkbox(page, 'Agree to terms')).not.toBeChecked();
  await field(page, 'Account').fill(ACCOUNTS.user.email!);
  await passwordField(page).fill('WrongPass123');
  await setChecked(checkbox(page, 'Agree to terms'));
  await loginSubmit(page).click();
  await alertText(page, 'Incorrect account or password');
  await visible(field(page, 'Account'));
  await expect(action(page, 'My account')).toHaveCount(0);
});

test('REQ-1.3: Require legal acceptance', async ({ page }) => {
  await openHome(page);
  await openLogin(page);
  await expect(checkbox(page, 'Agree to terms')).not.toBeChecked();
  await field(page, 'Account').fill(ACCOUNTS.user.email!);
  await passwordField(page).fill(ACCOUNTS.user.password!);
  await loginSubmit(page).click();
  await alertText(page, 'Agree to terms first');
  await visible(field(page, 'Account'));
  await expect(action(page, 'My account')).toHaveCount(0);
});
