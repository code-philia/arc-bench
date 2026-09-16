import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.5.1
// fixtures: accounts.orderHistory, order_history

test('REQ-8.5.1: View Order List', async ({ page }) => {
  await h.openOrderHistory(page, h.FIXTURES.accounts.orderHistory);
  for (const column of ['Order reference', 'Date', 'Total', 'Status']) {
    await expect(page.getByRole('columnheader', { name: column, exact: true })).toBeVisible();
  }
});
