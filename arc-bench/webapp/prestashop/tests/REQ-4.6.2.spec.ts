import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.6.2
// fixtures: products.cart462

test('REQ-4.6.2: Continue Shopping After Add', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.cart462);
  await h.addProductToCart(page);
  await page.getByRole('button', { name: /^CONTINUE SHOPPING$/i }).click();
  await expect(page.getByRole('heading', { name: /^Hummingbird cart 4\.6\.2 t-shirt$/i })).toBeVisible();
});
