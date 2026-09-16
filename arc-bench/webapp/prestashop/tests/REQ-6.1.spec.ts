import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.1
// fixtures: products.checkout61

test('REQ-6.1: Start Checkout', async ({ page }) => {
  await h.startCheckoutWithProduct(page, h.FIXTURES.products.checkout61);
  await expect(page.getByRole('heading', { name: /^Personal information$/i })).toBeVisible();
});
