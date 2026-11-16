// requirement: REQ-3.12
import { expect } from "@playwright/test";
import { test, field, button, region, checkbox, visible, heading, openHome, openBooking, newMobile, travelerInput } from "./helpers";

test('REQ-3.12: Require booking terms before order submission', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  const passenger = travelerInput('Passenger');
  await field(region(page, 'Passenger details'), 'Full name').fill(passenger.name);
  await field(region(page, 'Passenger details'), 'ID number').fill(passenger.id);
  await field(page, 'Contact mobile').fill(newMobile());
  await expect(checkbox(page, 'Agree to booking terms')).not.toBeChecked();
  await button(page, 'Submit order').click();
  await visible(page.getByRole('alert'));
  await heading(page, 'Book flight');
  await expect(page.getByRole('heading', { name: 'Payment', exact: true })).toHaveCount(0);
});
