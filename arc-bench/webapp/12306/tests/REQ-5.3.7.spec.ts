import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.7
// fixtures: bookable_user, bookable_route, passenger_manager_user

test('REQ-5.3.7: Show a cancelled order in the uncompleted orders tab', async ({ page }) => {
  await h.reachPaymentPage(page);
  await page.locator('.payment-page').getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page).toHaveURL(/\/center\/orders\?tab=uncompleted/);
  await h.expectTextsVisible(page, ['Uncompleted orders', 'Cancelled']);
  await expect(page.locator('.orders-table tbody tr').filter({ hasText: 'Cancelled' })).not.toHaveCount(0);
});
