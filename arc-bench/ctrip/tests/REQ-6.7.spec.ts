// requirement: REQ-6.7
import { test, expect } from "@playwright/test";
import { field, button, action, region, visible, openHome, installClock, loginOwner, openSecurity } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-6.7: Reject a password change with an incorrect current password', async ({ page }, testInfo) => {
  await openHome(page);
  await openSecurity(page, 'profile_read');
  await button(region(page, 'Login password'), 'Change').click();
  await field(page, 'Current password').fill('WrongPass123');
  await field(page, 'New password').fill('NewTravel1234!');
  await field(page, 'Confirm new password').fill('NewTravel1234!');
  await button(page, 'Complete').click();
  await visible(page.getByRole('alert'));
  await visible(field(page, 'Current password'));
  await expect(page.getByText('Sign in again', { exact: true })).not.toBeVisible();
  await openHome(page);
  await action(page, 'My account').hover();
  await page.getByRole('menuitem', { name: 'Log out', exact: true }).click();
  await loginOwner(page, 'profile_read');
  await visible(action(page, 'My account'));
});
