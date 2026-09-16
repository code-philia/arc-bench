import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.6.1
// fixtures: products.cart461

test('REQ-4.6.1: Add Product to Cart', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.cart461);
  await h.addProductToCart(page);
  await expect(page.getByRole('heading', { name: /^Product successfully added to your shopping cart$/i })).toBeVisible();
});
