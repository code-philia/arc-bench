import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.7
// fixtures: bookable_user, bookable_route, passenger_manager_user

test('REQ-5.2.7: Submit the booking form with an unavailable ticket class', async ({ page }) => {
  await h.openBookingForm(page, true);
  await h.selectPassengerForBooking(page);
  const ticketClass = page.getByRole('combobox').filter({ has: page.getByRole('option', { name: 'Second-class seat' }) }).first();
  await ticketClass.selectOption({ label: 'Second-class seat' });
  await h.clickNamed(page, 'Place order');
  await h.expectErrorFeedback(page, 'Sorry, there are no tickets available for the selected ticket class.');
});
