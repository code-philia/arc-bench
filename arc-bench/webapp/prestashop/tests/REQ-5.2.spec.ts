import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2
// fixtures: products.cart52

test('REQ-5.2: Cart Product List', async ({ page }) => {
  await h.openCartWithProduct(page, h.FIXTURES.products.cart52);
  await expect(page.getByRole('link', { name: /^Hummingbird cart 5\.2 t-shirt$/i })).toBeVisible();
  await expect(page.getByRole('spinbutton', { name: /^Quantity for Hummingbird cart 5\.2 t-shirt$/i })).toBeVisible();
  await expect(page.getByText(/^Unit price /i)).toBeVisible();
  await expect(page.getByText(/^Subtotal$/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /^Remove Hummingbird cart 5\.2 t-shirt$/i })).toBeVisible();
});
