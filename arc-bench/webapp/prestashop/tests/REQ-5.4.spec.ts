import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.4
// fixtures: products.cart54

test('REQ-5.4: Delete Product', async ({ page }) => {
  await h.openCartWithProduct(page, h.FIXTURES.products.cart54);
  await page.getByRole('button', { name: /^Remove Hummingbird cart 5\.4 t-shirt$/i }).click();
  await expect(page.getByRole('heading', { name: /^Your cart is empty$/i })).toBeVisible();
});
