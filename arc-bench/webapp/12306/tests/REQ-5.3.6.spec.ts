import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.6
// fixtures: bookable_user, bookable_route, passenger_manager_user

test('REQ-5.3.6: Show a paid upcoming order in the upcoming trips tab', async ({ page }) => {
  await h.reachPaymentPage(page);
  await h.clickNamed(page, 'Pay');
  await expect(page).toHaveURL(/\/center\/orders\?tab=upcoming/);
  await h.expectTextsVisible(page, ['Upcoming trips']);
  await expect(page.locator('.orders-table tbody tr').filter({ hasText: 'G532' })).not.toHaveCount(0);
});
