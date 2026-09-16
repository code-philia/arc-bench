import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3
// fixtures: products.cart53

test('REQ-5.3: Modify Product Quantity', async ({ page }) => {
  await h.openCartWithProduct(page, h.FIXTURES.products.cart53);
  await page.getByRole('button', { name: /^Increase quantity$/i }).click();
  await expect(page.getByRole('spinbutton', { name: /^Quantity for Hummingbird cart 5\.3 t-shirt$/i })).toHaveValue('2');
  await expect(page.getByText(/^Subtotal$/i)).toBeVisible();
  await expect(page.getByText(/^Total \(tax incl\.\)$/i)).toBeVisible();
});
