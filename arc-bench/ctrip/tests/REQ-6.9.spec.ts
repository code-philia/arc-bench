// requirement: REQ-6.9
import { test, expect } from "@playwright/test";
import { field, button, region, visible, openHome, installClock, openSecurity } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-6.9: Reject an incorrect current-email verification code', async ({ page }, testInfo) => {
  await openHome(page);
  await openSecurity(page, 'email_binding');
  await button(region(page, 'Bound email'), 'Change').click();
  await button(page, 'Send verification code').click();
  await field(page, 'Verification code').fill('000000');
  await button(page, 'Next, verify new email').click();
  await visible(page.getByRole('alert'));
  await visible(field(page, 'Verification code'));
  await expect(field(page, 'New email')).not.toBeVisible();
});
