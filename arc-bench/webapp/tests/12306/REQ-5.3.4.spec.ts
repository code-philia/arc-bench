import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.4
// fixtures: bookable_user, bookable_route, passenger_manager_user

test('REQ-5.3.4: Complete payment from the payment page', async ({ page }) => {
  await h.reachPaymentPage(page);
  await h.clickNamed(page, 'Pay');
  await h.expectSuccessFeedback(page);
});
