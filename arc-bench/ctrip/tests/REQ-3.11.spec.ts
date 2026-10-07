// requirement: REQ-3.11
import { test, expect } from "@playwright/test";
import { field, button, region, checkbox, flight, heading, alertText, openHome, installClock, openBooking } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-3.11: Reject order submission with an invalid passenger ID', async ({ page }, testInfo) => {
  await openHome(page);
  await openBooking(page);
  await field(region(page, 'Passenger details'), 'Full name').fill('Wang Wu');
  await field(region(page, 'Passenger details'), 'ID number').fill('123');
  await field(page, 'Contact mobile').fill('13800000014');
  await checkbox(page, 'Agree to booking terms').check();
  await button(page, 'Submit order').click();
  await alertText(region(page, 'Passenger details'), 'Enter a valid ID number');
  await heading(page, 'Book flight');
  await expect(page.getByRole('heading', { name: 'Payment', exact: true })).toHaveCount(0);
});
