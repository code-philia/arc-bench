import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.12
// fixtures: orders_upcoming_user

test('REQ-4.2.12: Open upcoming trips from the booking dropdown', async ({ page }) => {
  await h.openHome(page);
  await h.loginAs(page);
  await h.hoverNamed(page, /Booking/i);
  await h.clickNamed(page, /Upcoming trips/i);
  await h.expectTextsVisible(page, ['Upcoming trips']);
});
