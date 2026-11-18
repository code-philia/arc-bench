// requirement: REQ-6.9
import { expect } from "@playwright/test";
import { test, field, button, visible, openHome, openSecurity, securityChange } from "./helpers";

test('REQ-6.9: Reject an incorrect current-email verification code', async ({ page }) => {
  await openHome(page);
  await openSecurity(page, 'user');
  await (await securityChange(page, 'Bound email')).click();
  await button(page, 'Send verification code').click();
  await field(page, 'Verification code').fill('000000');
  await button(page, 'Next, verify new email').click();
  await visible(page.getByRole('alert'));
  await visible(field(page, 'Verification code'));
  await expect(field(page, 'New email')).not.toBeVisible();
});
