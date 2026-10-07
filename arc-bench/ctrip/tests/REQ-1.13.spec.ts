// requirement: REQ-1.13
import { test, expect } from "@playwright/test";
import { field, button, action, checkbox, visible, openHome, installClock, smsLoginForm } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-1.13: Require a sent code before SMS authentication', async ({ page }, testInfo) => {
  await openHome(page);
  await smsLoginForm(page);
  await field(page, 'Mobile number').fill('13800000011');
  await field(page, 'Verification code').fill('123456');
  await checkbox(page, 'Agree to terms').check();
  await button(page, 'Log in').click();
  await visible(page.getByRole('alert'));
  await visible(field(page, 'Mobile number'));
  await expect(action(page, 'My account')).toHaveCount(0);
});
