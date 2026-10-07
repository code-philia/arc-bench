// requirement: REQ-1.4
import { test, expect } from "@playwright/test";
import { field, button, action, checkbox, visible, heading, textVisible, alertText, openHome, installClock, smsLoginForm } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-1.4: Authenticate with sent code', async ({ page }, testInfo) => {
  await openHome(page);
  await smsLoginForm(page);
  await textVisible(page, '+86');
  await field(page, 'Mobile number').fill('13800000011');
  await button(page, 'Send code').click();
  await visible(action(page, 'Resend code'));
  await field(page, 'Verification code').fill('123456');
  await checkbox(page, 'Agree to terms').check();
  await button(page, 'Log in').click();
  await heading(page, 'Ctrip Travel');
  await visible(action(page, 'My account'));
});

test('REQ-1.4: Reject sending without mobile', async ({ page }, testInfo) => {
  await openHome(page);
  await smsLoginForm(page);
  await button(page, 'Send code').click();
  await alertText(page, 'Enter your mobile number');
  await expect(action(page, 'My account')).toHaveCount(0);
});

test('REQ-1.4: Reject empty verification code', async ({ page }, testInfo) => {
  await openHome(page);
  await smsLoginForm(page);
  await expect(checkbox(page, 'Agree to terms')).not.toBeChecked();
  await field(page, 'Mobile number').fill('13800000041');
  await button(page, 'Send code').click();
  await field(page, 'Verification code').fill('');
  await checkbox(page, 'Agree to terms').check();
  await button(page, 'Log in').click();
  await alertText(page, 'Enter your verification code');
  await visible(field(page, 'Mobile number'));
  await expect(action(page, 'My account')).toHaveCount(0);
});

test('REQ-1.4: Reject incorrect verification code', async ({ page }, testInfo) => {
  await openHome(page);
  await smsLoginForm(page);
  await expect(checkbox(page, 'Agree to terms')).not.toBeChecked();
  await field(page, 'Mobile number').fill('13800000042');
  await button(page, 'Send code').click();
  await field(page, 'Verification code').fill('000000');
  await checkbox(page, 'Agree to terms').check();
  await button(page, 'Log in').click();
  await alertText(page, 'Incorrect verification code');
  await visible(field(page, 'Mobile number'));
  await expect(action(page, 'My account')).toHaveCount(0);
});

test('REQ-1.4: Require SMS legal acceptance', async ({ page }, testInfo) => {
  await openHome(page);
  await smsLoginForm(page);
  await expect(checkbox(page, 'Agree to terms')).not.toBeChecked();
  await field(page, 'Mobile number').fill('13800000043');
  await button(page, 'Send code').click();
  await field(page, 'Verification code').fill('123456');
  await button(page, 'Log in').click();
  await alertText(page, 'Agree to terms first');
  await visible(field(page, 'Mobile number'));
  await expect(action(page, 'My account')).toHaveCount(0);
});

