import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.6
// fixtures: booking_upcoming_user, bookable_route

test('REQ-5.3.6: Show a paid upcoming order in the upcoming trips tab', async ({ page }) => {
  await h.reachPaymentPage(page, h.FIXTURES.bookingUpcomingUser);
  await h.clickNamed(page, 'Pay');
  await h.expectTextsVisible(page, ['Upcoming trips', 'Refund']);
});
