// requirement: REQ-3.3
import { test, expect } from "@playwright/test";
import { field, region, alertText, openHome, installClock, openBooking } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-3.3: Accept checksum-valid passenger identity', async ({ page }, testInfo) => {
  await openHome(page);
  await openBooking(page);
  await field(region(page, 'Passenger details'), 'Full name').fill('Wang Wu');
  await field(region(page, 'Passenger details'), 'ID number').fill('110101199001011237');
  await field(page, 'Contact mobile').focus();
  await expect(field(region(page, 'Passenger details'), 'ID number')).toHaveValue('110101199001011237');
  await expect(region(page, 'Passenger details').getByRole('alert')).not.toBeVisible();
});

test('REQ-3.3: Reject invalid passenger identity', async ({ page }, testInfo) => {
  await openHome(page);
  await openBooking(page);
  await field(region(page, 'Passenger details'), 'Full name').fill('Wang Wu');
  await field(region(page, 'Passenger details'), 'ID number').fill('123');
  await field(page, 'Contact mobile').focus();
  await alertText(region(page, 'Passenger details'), 'Enter a valid ID number');
});

