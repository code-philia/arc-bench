import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.6.3
// fixtures: products.cart463

test('REQ-4.6.3: Proceed to Checkout After Add', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.cart463);
  await h.addProductToCart(page);
  await page.getByRole('button', { name: /^PROCEED TO CHECKOUT$/i }).click();
  await expect(page.getByRole('heading', { name: /^Shopping cart$/i })).toBeVisible();
});
