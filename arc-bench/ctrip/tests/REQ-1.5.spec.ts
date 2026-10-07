// requirement: REQ-1.5
import { test, expect } from "@playwright/test";
import { field, button, action, dialog, nav, visible, heading, openHome, installClock, openLogin, login } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-1.5: Open registration agreement', async ({ page }, testInfo) => {
  await openHome(page);
  await nav(page).getByRole('link', { name: 'Register', exact: true }).click();
  await heading(page, 'Register');
  await visible(dialog(page, 'Registration agreement and privacy policy'));
  await visible(button(dialog(page, 'Registration agreement and privacy policy'), 'Agree and continue'));
  await visible(button(dialog(page, 'Registration agreement and privacy policy'), 'Decline'));
});

test('REQ-1.5: Accept from login registration entry', async ({ page }, testInfo) => {
  await openHome(page);
  await openLogin(page);
  await action(page, 'Free registration').click();
  await button(dialog(page, 'Registration agreement and privacy policy'), 'Agree and continue').click();
  await heading(page, 'Verify mobile number');
  await visible(field(page, 'Mobile number'));
  await visible(field(page, 'Verification code'));
});

test('REQ-1.5: Decline registration', async ({ page }, testInfo) => {
  await openHome(page);
  await nav(page).getByRole('link', { name: 'Register', exact: true }).click();
  await button(dialog(page, 'Registration agreement and privacy policy'), 'Decline').click();
  await heading(page, 'Ctrip Travel');
  await visible(nav(page).getByRole('link', { name: 'Log in', exact: true }));
  await expect(dialog(page, 'Registration agreement and privacy policy')).toHaveCount(0);
  await expect(action(page, 'My account')).toHaveCount(0);
});

