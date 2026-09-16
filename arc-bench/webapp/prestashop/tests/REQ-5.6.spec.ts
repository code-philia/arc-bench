import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.6
// fixtures: products.cart56

test('REQ-5.6: Continue Shopping Link', async ({ page }) => {
  await h.openCartWithProduct(page, h.FIXTURES.products.cart56);
  await page.getByRole('link', { name: /^Continue shopping$/i }).click();
  await expect(page.getByRole('heading', { name: /^Men$/i })).toBeVisible();
});
