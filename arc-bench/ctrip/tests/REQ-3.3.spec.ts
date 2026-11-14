// requirement: REQ-3.3
import { expect } from "@playwright/test";
import { test, expectFieldValue, field, region, alertText, openHome, openBooking, travelerInput } from "./helpers";

test('REQ-3.3: Accept checksum-valid passenger identity', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  const passenger = travelerInput('Passenger');
  await field(region(page, 'Passenger details'), 'Full name').fill(passenger.name);
  await field(region(page, 'Passenger details'), 'ID number').fill(passenger.id);
  await field(page, 'Contact mobile').focus();
  await expectFieldValue(field(region(page, 'Passenger details'), 'ID number'), passenger.id);
  await expect(region(page, 'Passenger details').getByRole('alert')).not.toBeVisible();
});

test('REQ-3.3: Reject invalid passenger identity', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  const passenger = travelerInput('Passenger');
  await field(region(page, 'Passenger details'), 'Full name').fill(passenger.name);
  await field(region(page, 'Passenger details'), 'ID number').fill('123');
  await field(page, 'Contact mobile').focus();
  await alertText(region(page, 'Passenger details'), 'Enter a valid ID number');
});
