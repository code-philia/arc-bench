// requirement: REQ-6.4
import { test, expect } from "@playwright/test";
import { field, button, action, region, checkbox, visible, textVisible, alertText, openHome, installClock, openLogin, openSecurity, ACCOUNTS } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-6.4: Replace password and require reauthentication', async ({ page }, testInfo) => {
  await openHome(page);
  await openSecurity(page, 'password_change');
  await button(region(page, 'Login password'), 'Change').click();
  await field(page, 'Current password').fill('Travel1234');
  await field(page, 'New password').fill('NewTravel1234!');
  await field(page, 'Confirm new password').fill('NewTravel1234!');
  await textVisible(region(page, 'Password strength'), 'Strong');
  await button(page, 'Complete').click();
  await textVisible(page, 'Sign in again');
  await openHome(page);
  await openLogin(page);
  await field(page, 'Account').fill(ACCOUNTS.password_change.email!);
  await field(page, 'Password').fill('Travel1234');
  await checkbox(page, 'Agree to terms').check();
  await button(page, 'Log in').click();
  await alertText(page, 'Incorrect account or password');
  await field(page, 'Password').fill('NewTravel1234!');
  await button(page, 'Log in').click();
  await visible(action(page, 'My account'));
});

