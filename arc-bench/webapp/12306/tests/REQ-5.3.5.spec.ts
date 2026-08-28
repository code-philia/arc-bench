import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.5
// fixtures: bookable_user, bookable_route, passenger_manager_user

test('REQ-5.3.5: Show an unpaid order in the uncompleted orders tab', async ({ page }) => {
  await h.reachPaymentPage(page);
  await page.goto('/center/orders?tab=uncompleted');
  await h.clickNamed(page, 'Uncompleted orders');
  await h.expectTextsVisible(page, ['Uncompleted orders', 'Pay']);
  await expect(page.locator('.orders-table tbody tr').filter({ hasText: 'Pay' })).not.toHaveCount(0);
});
