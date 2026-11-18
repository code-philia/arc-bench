// requirement: REQ-3.4
import { test, expect } from '@playwright/test';
import { home, action, region, openProduct, DETAIL } from './helpers';

test("REQ-3.4: Read description tab", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL); await action(page, 'Description').click();
  await expect(region(page, 'Description')).toContainText(/regular.fit/i);
});

test("REQ-3.4: Read details tab", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL); await action(page, 'Product Details').click();
  const panel = region(page, 'Product Details');
  for (const text of ['Reference', 'HB-DETAIL', 'Data sheet', 'cotton', 'Features']) await expect(panel).toContainText(text);
  await expect(panel).toContainText(/regular.fit/i);
});
