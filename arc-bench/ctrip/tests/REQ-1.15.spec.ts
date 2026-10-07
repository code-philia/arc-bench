// requirement: REQ-1.15
import { test, expect } from "@playwright/test";
import { field, button, dialog, nav, heading, alertText, openHome, installClock, registrationPhone } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-1.15: Reject registration without a verification code', async ({ page }, testInfo) => {
  await openHome(page);
  await nav(page).getByRole('link', { name: 'Register', exact: true }).click();
  await button(dialog(page, 'Registration agreement and privacy policy'), 'Agree and continue').click();
  const phone = registrationPhone(testInfo);
  await field(page, 'Mobile number').fill(phone);
  await button(page, 'Send code').click();
  await field(page, 'Verification code').fill('');
  await button(page, 'Next, set password').click();
  await alertText(page, 'Enter your verification code');
  await heading(page, 'Verify mobile number');
  await expect(field(page, 'Mobile number')).toHaveValue(phone);
  await expect(page.getByRole('heading', { name: 'Set password', exact: true })).toHaveCount(0);
});
