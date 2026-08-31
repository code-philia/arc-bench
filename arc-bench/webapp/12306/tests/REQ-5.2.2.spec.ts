import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.2
// fixtures: bookable_user, bookable_route, passenger_manager_user

test('REQ-5.2.2: Display the booking information section for the selected train', async ({ page }) => {
  await h.openBookingForm(page, true);
  await h.expectTextsVisible(page, ['Train Information', 'Place order']);
  await h.expectTextsVisible(page, ['business-class seat', 'first-class seat', 'second-class seat', 'standing ticket']);
  await h.expectTextsVisible(page, [/1 left/i, /None left/i, /Enough left/i]);
});
