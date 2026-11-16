// requirement: REQ-3.11
import { expect } from "@playwright/test";
import { test, setChecked, field, button, region, checkbox, heading, alertText, openHome, openBooking, newMobile, travelerInput } from "./helpers";

test('REQ-3.11: Reject order submission with an invalid passenger ID', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  const passenger = travelerInput('Passenger');
  await field(region(page, 'Passenger details'), 'Full name').fill(passenger.name);
  await field(region(page, 'Passenger details'), 'ID number').fill('123');
  await field(page, 'Contact mobile').fill(newMobile());
  await setChecked(checkbox(page, 'Agree to booking terms'));
  await button(page, 'Submit order').click();
  await alertText(region(page, 'Passenger details'), 'Enter a valid ID number');
  await heading(page, 'Book flight');
  await expect(page.getByRole('heading', { name: 'Payment', exact: true })).toHaveCount(0);
});
