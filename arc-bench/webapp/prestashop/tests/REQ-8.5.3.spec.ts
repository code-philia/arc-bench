import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.5.3
// fixtures: accounts.orderHistory, order_history

test('REQ-8.5.3: Reorder', async ({ page }) => {
  await h.openOrderHistory(page, h.FIXTURES.accounts.orderHistory);
  await page.getByRole('button', { name: /^Reorder$/i }).click();
  await expect(page.getByText(/^The products from your order were added to the cart\.$/i)).toBeVisible();
});
