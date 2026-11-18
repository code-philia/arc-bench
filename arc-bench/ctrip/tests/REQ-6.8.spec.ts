// requirement: REQ-6.8
import { expect } from "@playwright/test";
import { test, field, button, visible, openHome, openSecurity, securityChange, newMobile, registerAccount } from "./helpers";

test('REQ-6.8: Reject phone-change identity verification with wrong password', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openSecurity(page);
  await (await securityChange(page, 'Bound phone')).click();
  await field(page, 'Login password').fill('WrongPass123');
  const mobile = newMobile();
  await field(page, 'New phone').fill(mobile);
  await button(page, 'Next, verify new phone').click();
  await visible(page.getByRole('alert'));
  await visible(field(page, 'Login password'));
  await visible(field(page, 'New phone'));
  await visible(button(page, 'Next, verify new phone'));
  await expect(field(page, 'Verification code')).not.toBeVisible();
  await expect(page.getByText(`Code sent to ${mobile}`, { exact: true })).not.toBeVisible();
});
