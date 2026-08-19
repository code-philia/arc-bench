import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.1
// fixtures: bookable_user, bookable_route, passenger_manager_user

test('REQ-5.2.1: Open the booking form from one search result row', async ({ page }) => {
  await h.openBookingForm(page, true);
  await h.expectTextsVisible(page, ['Train Information']);
});
