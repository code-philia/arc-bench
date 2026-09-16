import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.5
// fixtures: products.cart55

test('REQ-5.5: Cart Summary', async ({ page }) => {
  await h.openCartWithProduct(page, h.FIXTURES.products.cart55);
  await expect(page.getByRole('heading', { name: /^Summary$/i })).toBeVisible();
  for (const label of ['Subtotal', 'Shipping', 'Discount', 'Tax included', 'Total (tax incl.)']) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
});
