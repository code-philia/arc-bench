// requirement: REQ-7.5
import { test, expect } from '@playwright/test';
import { home, action, region, expectMoney, history, historyRow, expectOnlyHistoryOrder, HISTORY_PRODUCT } from './helpers';

test("REQ-7.5: Inspect historical order list", async ({ page }) => {
  await home(page); await history(page); await expectOnlyHistoryOrder(page); const row = historyRow(page);
  for (const text of ['PS-HISTORY-001', HISTORY_PRODUCT, '2026-07-18', 'Delivered']) await expect(row).toContainText(text); await expectMoney(region(row, 'Total'), 34);
  for (const command of ['Details', 'Reorder', 'PDF']) await expect(action(row, command)).toBeVisible();
});

test("REQ-7.5: Inspect selected order details", async ({ page }) => {
  await home(page); await history(page); await action(historyRow(page), 'Details').click(); const details = region(page, 'Order details');
  for (const text of ['PS-HISTORY-001', HISTORY_PRODUCT, '1 Commerce Road', 'Shanghai', '200000', 'China', 'Bank wire']) await expect(details).toContainText(text);
});
