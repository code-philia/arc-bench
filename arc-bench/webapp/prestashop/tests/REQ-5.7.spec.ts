import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.7
// fixtures: products.cart57

test('REQ-5.7: Proceed to Checkout Button', async ({ page }) => {
  await h.openCartWithProduct(page, h.FIXTURES.products.cart57);
  await page.getByRole('button', { name: /^PROCEED TO CHECKOUT$/i }).click();
  await expect(page.getByRole('heading', { name: /^Personal information$/i })).toBeVisible();
});
