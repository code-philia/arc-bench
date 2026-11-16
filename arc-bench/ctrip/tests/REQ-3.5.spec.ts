// requirement: REQ-3.5
import { expect } from "@playwright/test";
import { test, expectFieldValue, field, region, openHome, openBooking, newMobile, registerAccount } from "./helpers";

test('REQ-3.5: Replace prefilled contact mobile', async ({ page }) => {
  await openHome(page);
  const account = await registerAccount(page);
  await openBooking(page);
  await expectFieldValue(field(page, 'Contact mobile'), account.mobile);
  const mobile = newMobile();
  await field(page, 'Contact mobile').fill(mobile);
  await field(region(page, 'Passenger details'), 'Full name').focus();
  await expectFieldValue(field(page, 'Contact mobile'), mobile);
  await expect(region(page, 'Contact information').getByRole('alert')).not.toBeVisible();
});
