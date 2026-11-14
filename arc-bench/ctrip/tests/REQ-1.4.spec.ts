// requirement: REQ-1.4
import { expect } from "@playwright/test";
import { test, setChecked, field, button, action, checkbox, visible, heading, textVisible, alertText, openHome, smsLoginForm, SMS_CODE, loginSubmit, createMobileAccount } from "./helpers";

test('REQ-1.4: Authenticate with sent code', async ({ page }) => {
  await openHome(page);
  const { mobile } = await createMobileAccount(page);
  await openHome(page);
  await smsLoginForm(page);
  await textVisible(page, '+86');
  await field(page, 'Mobile number').fill(mobile);
  await button(page, 'Send code').click();
  await visible(action(page, 'Resend code'));
  await field(page, 'Verification code').fill(SMS_CODE);
  await setChecked(checkbox(page, 'Agree to terms'));
  await loginSubmit(page).click();
  await heading(page, 'Ctrip Travel');
  await visible(action(page, 'My account'));
});

test('REQ-1.4: Reject sending without mobile', async ({ page }) => {
  await openHome(page);
  await smsLoginForm(page);
  await button(page, 'Send code').click();
  await alertText(page, 'Enter your mobile number');
  await expect(action(page, 'My account')).toHaveCount(0);
});

test('REQ-1.4: Reject empty verification code', async ({ page }) => {
  await openHome(page);
  const { mobile } = await createMobileAccount(page);
  await openHome(page);
  await smsLoginForm(page);
  await expect(checkbox(page, 'Agree to terms')).not.toBeChecked();
  await field(page, 'Mobile number').fill(mobile);
  await button(page, 'Send code').click();
  await field(page, 'Verification code').fill('');
  await setChecked(checkbox(page, 'Agree to terms'));
  await loginSubmit(page).click();
  await alertText(page, 'Enter your verification code');
  await visible(field(page, 'Mobile number'));
  await expect(action(page, 'My account')).toHaveCount(0);
});

test('REQ-1.4: Reject incorrect verification code', async ({ page }) => {
  await openHome(page);
  const { mobile } = await createMobileAccount(page);
  await openHome(page);
  await smsLoginForm(page);
  await expect(checkbox(page, 'Agree to terms')).not.toBeChecked();
  await field(page, 'Mobile number').fill(mobile);
  await button(page, 'Send code').click();
  await field(page, 'Verification code').fill('000000');
  await setChecked(checkbox(page, 'Agree to terms'));
  await loginSubmit(page).click();
  await alertText(page, 'Incorrect verification code');
  await visible(field(page, 'Mobile number'));
  await expect(action(page, 'My account')).toHaveCount(0);
});

test('REQ-1.4: Require SMS legal acceptance', async ({ page }) => {
  await openHome(page);
  const { mobile } = await createMobileAccount(page);
  await openHome(page);
  await smsLoginForm(page);
  await expect(checkbox(page, 'Agree to terms')).not.toBeChecked();
  await field(page, 'Mobile number').fill(mobile);
  await button(page, 'Send code').click();
  await field(page, 'Verification code').fill(SMS_CODE);
  await loginSubmit(page).click();
  await alertText(page, 'Agree to terms first');
  await visible(field(page, 'Mobile number'));
  await expect(action(page, 'My account')).toHaveCount(0);
});
