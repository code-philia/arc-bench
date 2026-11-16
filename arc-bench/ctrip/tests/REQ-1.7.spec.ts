// requirement: REQ-1.7
import { expect } from "@playwright/test";
import { test, setChecked, field, button, action, checkbox, visible, heading, alertText, openHome, registerToPassword, newMobile, accountInput, textVisible, loginSubmit, passwordField } from "./helpers";

test('REQ-1.7: Complete registration and authenticate created account', async ({ page }) => {
  await openHome(page);
  const account = accountInput();
  const phone = account.mobile;
  await registerToPassword(page, phone);
  await passwordField(page).fill(account.password);
  await field(page, 'Confirm password').fill(account.password);
  await button(page, 'Complete registration').click();
  await textVisible(page, 'Registration successful');
  await heading(page, 'Log in');
  await visible(field(page, 'Account'));
  await visible(passwordField(page));
  await field(page, 'Account').fill(phone);
  await passwordField(page).fill(account.password);
  await setChecked(checkbox(page, 'Agree to terms'));
  await loginSubmit(page).click();
  await visible(action(page, 'My account'));
});

test('REQ-1.7: Reject mismatched passwords', async ({ page }) => {
  await openHome(page);
  await registerToPassword(page, newMobile());
  await passwordField(page).fill('Travel1234');
  await field(page, 'Confirm password').fill('Travel5678');
  await button(page, 'Complete registration').click();
  await alertText(page, 'Passwords do not match');
  await heading(page, 'Set password');
  await expect(action(page, 'My account')).toHaveCount(0);
});

test('REQ-1.7: Reject weak password', async ({ page }) => {
  await openHome(page);
  await registerToPassword(page, newMobile());
  await passwordField(page).fill('1234567');
  await field(page, 'Confirm password').fill('1234567');
  await button(page, 'Complete registration').click();
  await alertText(page, 'Password must contain letters and numbers and be at least 8 characters');
  await heading(page, 'Set password');
  await expect(action(page, 'My account')).toHaveCount(0);
});
