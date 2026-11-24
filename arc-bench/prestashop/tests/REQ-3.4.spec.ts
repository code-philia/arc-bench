// requirement: REQ-3.4
import { test, expect } from '@playwright/test';
import { home, action, region, openProduct, expectProductDetails, DETAIL } from './helpers';

test("REQ-3.4: Read description tab", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL); await action(page, 'Description').click();
  await expect(region(page, 'Description')).toContainText(/regular.fit/i);
});

test("REQ-3.4: Read details tab", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL); await action(page, 'Product Details').click();
  await expectProductDetails(page);
});
