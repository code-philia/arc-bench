import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.3
// fixtures: bookable_user, bookable_route, passenger_manager_user

test('REQ-5.3.3: Cancel the order from the payment page', async ({ page }) => {
  await h.reachPaymentPage(page);
  await page.locator('.payment-page').getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page).toHaveURL(/\/center\/orders\?tab=uncompleted/);
  await h.expectSuccessFeedback(page);
  await expect(page.locator('.orders-table tbody tr').filter({ hasText: 'Cancelled' })).toHaveCount(1);
});
