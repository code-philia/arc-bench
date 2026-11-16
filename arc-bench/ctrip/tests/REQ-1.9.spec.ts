// requirement: REQ-1.9
import { expect } from "@playwright/test";
import { test, field, button, dialog, nav, heading, alertText, openHome, action, newMobile } from "./helpers";

test('REQ-1.9: Reject registration with an incorrect sent code', async ({ page }) => {
  await openHome(page);
  await action(nav(page), 'Register').click();
  await button(dialog(page, 'Registration agreement and privacy policy'), 'Agree and continue').click();
  const phone = newMobile();
  await field(page, 'Mobile number').fill(phone);
  await button(page, 'Send code').click();
  await field(page, 'Verification code').fill('000000');
  await button(page, 'Next, set password').click();
  await alertText(page, 'Incorrect verification code');
  await heading(page, 'Verify mobile number');
  await expect(page.getByRole('heading', { name: 'Set password', exact: true })).toHaveCount(0);
});
