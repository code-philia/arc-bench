// requirement: REQ-6.8
import { test, expect } from "@playwright/test";
import { field, button, region, visible, heading, openHome, installClock, openSecurity } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-6.8: Reject phone-change identity verification with wrong password', async ({ page }, testInfo) => {
  await openHome(page);
  await openSecurity(page, 'phone_binding');
  await button(region(page, 'Bound phone'), 'Change').click();
  await field(page, 'Login password').fill('WrongPass123');
  await field(page, 'New phone').fill('13900000018');
  await button(page, 'Next, verify new phone').click();
  await visible(page.getByRole('alert'));
  await heading(page, 'Verify identity');
  await expect(page.getByRole('heading', { name: 'Verify new phone', exact: true })).toHaveCount(0);
  await expect(page.getByText('Code sent to 13900000018', { exact: true })).not.toBeVisible();
});
