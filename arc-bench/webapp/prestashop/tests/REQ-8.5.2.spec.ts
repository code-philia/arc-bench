import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.5.2
// fixtures: accounts.orderHistory, order_history

test('REQ-8.5.2: View Order Details', async ({ page }) => {
  await h.openOrderHistory(page, h.FIXTURES.accounts.orderHistory);
  await page.getByRole('button', { name: /^Details$/i }).click();
  await expect(page.getByRole('heading', { name: /^Order details ·/i })).toBeVisible();
  for (const section of ['Products', 'Shipping information', 'Payment information']) {
    await expect(page.getByRole('heading', { name: section, exact: true })).toBeVisible();
  }
});
