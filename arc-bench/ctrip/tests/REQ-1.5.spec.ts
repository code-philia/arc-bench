// requirement: REQ-1.5
import { expect } from "@playwright/test";
import { test, field, button, action, dialog, nav, visible, heading, openHome, openLogin } from "./helpers";

test('REQ-1.5: Open registration agreement', async ({ page }) => {
  await openHome(page);
  await action(nav(page), 'Register').click();
  await heading(page, 'Register');
  await visible(dialog(page, 'Registration agreement and privacy policy'));
  await visible(button(dialog(page, 'Registration agreement and privacy policy'), 'Agree and continue'));
  await visible(button(dialog(page, 'Registration agreement and privacy policy'), 'Decline'));
});

test('REQ-1.5: Accept from login registration entry', async ({ page }) => {
  await openHome(page);
  await openLogin(page);
  await action(page, 'Free registration').click();
  await button(dialog(page, 'Registration agreement and privacy policy'), 'Agree and continue').click();
  await heading(page, 'Verify mobile number');
  await visible(field(page, 'Mobile number'));
  await visible(field(page, 'Verification code'));
});

test('REQ-1.5: Decline registration', async ({ page }) => {
  await openHome(page);
  await action(nav(page), 'Register').click();
  await button(dialog(page, 'Registration agreement and privacy policy'), 'Decline').click();
  await heading(page, 'Ctrip Travel');
  await visible(action(nav(page), 'Log in'));
  await expect(dialog(page, 'Registration agreement and privacy policy')).toHaveCount(0);
  await expect(action(page, 'My account')).toHaveCount(0);
});
