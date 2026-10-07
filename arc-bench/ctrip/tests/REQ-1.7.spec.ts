// requirement: REQ-1.7
import { test, expect } from "@playwright/test";
import { field, button, action, checkbox, visible, heading, alertText, openHome, installClock, registrationPhone, registerToPassword } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-1.7: Complete registration and authenticate created account', async ({ page }, testInfo) => {
  await openHome(page);
  const phone = registrationPhone(testInfo);
  await registerToPassword(page, phone);
  await field(page, 'Password').fill('Travel1234');
  await field(page, 'Confirm password').fill('Travel1234');
  await button(page, 'Complete registration').click();
  await visible(page.getByRole('status').filter({ hasText: 'Registration successful' }));
  await heading(page, 'Log in');
  await visible(field(page, 'Account'));
  await visible(field(page, 'Password'));
  await field(page, 'Account').fill(phone);
  await field(page, 'Password').fill('Travel1234');
  await checkbox(page, 'Agree to terms').check();
  await button(page, 'Log in').click();
  await visible(action(page, 'My account'));
});

test('REQ-1.7: Reject mismatched passwords', async ({ page }, testInfo) => {
  await openHome(page);
  await registerToPassword(page, registrationPhone(testInfo));
  await field(page, 'Password').fill('Travel1234');
  await field(page, 'Confirm password').fill('Travel5678');
  await button(page, 'Complete registration').click();
  await alertText(page, 'Passwords do not match');
  await heading(page, 'Set password');
  await expect(action(page, 'My account')).toHaveCount(0);
});

test('REQ-1.7: Reject weak password', async ({ page }, testInfo) => {
  await openHome(page);
  await registerToPassword(page, registrationPhone(testInfo));
  await field(page, 'Password').fill('1234567');
  await field(page, 'Confirm password').fill('1234567');
  await button(page, 'Complete registration').click();
  await alertText(page, 'Password must contain letters and numbers and be at least 8 characters');
  await heading(page, 'Set password');
  await expect(action(page, 'My account')).toHaveCount(0);
});

