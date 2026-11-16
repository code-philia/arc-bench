// requirement: REQ-1.15
import { expect } from "@playwright/test";
import { test, expectFieldValue, field, button, dialog, nav, heading, alertText, openHome, action, newMobile } from "./helpers";

test('REQ-1.15: Reject registration without a verification code', async ({ page }) => {
  await openHome(page);
  await action(nav(page), 'Register').click();
  await button(dialog(page, 'Registration agreement and privacy policy'), 'Agree and continue').click();
  const phone = newMobile();
  await field(page, 'Mobile number').fill(phone);
  await button(page, 'Send code').click();
  await field(page, 'Verification code').fill('');
  await button(page, 'Next, set password').click();
  await alertText(page, 'Enter your verification code');
  await heading(page, 'Verify mobile number');
  await expectFieldValue(field(page, 'Mobile number'), phone);
  await expect(page.getByRole('heading', { name: 'Set password', exact: true })).toHaveCount(0);
});
