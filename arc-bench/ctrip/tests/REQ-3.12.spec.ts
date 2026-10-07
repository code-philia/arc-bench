// requirement: REQ-3.12
import { test, expect } from "@playwright/test";
import { field, button, region, checkbox, flight, visible, heading, openHome, installClock, openBooking, IDS } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-3.12: Require booking terms before order submission', async ({ page }, testInfo) => {
  await openHome(page);
  await openBooking(page);
  await field(region(page, 'Passenger details'), 'Full name').fill('Wang Wu');
  await field(region(page, 'Passenger details'), 'ID number').fill(IDS[0]);
  await field(page, 'Contact mobile').fill('13800000014');
  await expect(checkbox(page, 'Agree to booking terms')).not.toBeChecked();
  await button(page, 'Submit order').click();
  await visible(page.getByRole('alert'));
  await heading(page, 'Book flight');
  await expect(page.getByRole('heading', { name: 'Payment', exact: true })).toHaveCount(0);
});
