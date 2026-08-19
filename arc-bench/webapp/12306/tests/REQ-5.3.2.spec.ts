import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.2
// fixtures: bookable_user, bookable_route, passenger_manager_user

test('REQ-5.3.2: Open the payment page after confirming the order', async ({ page }) => {
  await h.reachPaymentPage(page);
  await h.expectTextsVisible(page, ['Seats are locked, Time remained to complete your payment:', 'Order details']);
});
