// requirement: REQ-3.5
import { test, expect } from "@playwright/test";
import { field, region, openHome, installClock, loginOwner, openBooking } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-3.5: Replace prefilled contact mobile', async ({ page }, testInfo) => {
  await openHome(page);
  await loginOwner(page, 'user');
  await openBooking(page);
  await expect(field(page, 'Contact mobile')).toHaveValue('13800000010');
  await field(page, 'Contact mobile').fill('13800000014');
  await field(region(page, 'Passenger details'), 'Full name').focus();
  await expect(field(page, 'Contact mobile')).toHaveValue('13800000014');
  await expect(region(page, 'Contact information').getByRole('alert')).not.toBeVisible();
});

