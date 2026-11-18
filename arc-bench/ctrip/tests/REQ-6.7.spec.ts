// requirement: REQ-6.7
import { expect } from "@playwright/test";
import { test, field, button, action, accountDestination, region, visible, openHome, openSecurity, securityChange, registerAccount, login } from "./helpers";

test('REQ-6.7: Reject a password change with an incorrect current password', async ({ page }) => {
  await openHome(page);
  const account = await registerAccount(page);
  await openSecurity(page);
  await (await securityChange(page, 'Login password')).click();
  await field(page, 'Current password').fill('WrongPass123');
  await field(page, 'New password').fill('NewTravel1234!');
  await field(page, 'Confirm new password').fill('NewTravel1234!');
  await button(page, 'Complete').click();
  await visible(page.getByRole('alert'));
  await visible(field(page, 'Current password'));
  await expect(page.getByText(/\bSign in again\b/)).not.toBeVisible();
  await openHome(page);
  await accountDestination(page, 'Log out');
  await login(page, account.mobile, account.password);
  await visible(action(page, 'My account'));
});
