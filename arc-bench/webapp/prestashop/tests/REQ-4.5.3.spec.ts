import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.3
// fixtures: products.detail

test('REQ-4.5.3: Direct Input Quantity', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await h.setProductQuantity(page, h.FIXTURES.products.detail.quantity!);
  await expect(page.getByRole('spinbutton', { name: /^Quantity$/i })).toHaveValue('3');
});
