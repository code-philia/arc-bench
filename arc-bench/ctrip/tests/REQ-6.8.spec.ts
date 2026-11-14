// requirement: REQ-6.8
import { expect } from "@playwright/test";
import { test, field, button, region, visible, heading, openHome, openSecurity, newMobile, registerAccount } from "./helpers";

test('REQ-6.8: Reject phone-change identity verification with wrong password', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openSecurity(page);
  await button(region(page, 'Bound phone'), 'Change').click();
  await field(page, 'Login password').fill('WrongPass123');
  const mobile = newMobile();
  await field(page, 'New phone').fill(mobile);
  await button(page, 'Next, verify new phone').click();
  await visible(page.getByRole('alert'));
  await heading(page, 'Verify identity');
  await expect(page.getByRole('heading', { name: 'Verify new phone', exact: true })).toHaveCount(0);
  await expect(page.getByText(`Code sent to ${mobile}`, { exact: true })).not.toBeVisible();
});
