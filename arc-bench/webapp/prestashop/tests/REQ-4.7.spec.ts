import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.7
// fixtures: products.detail

test('REQ-4.7: Add to Wishlist', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await page.getByRole('region', { name: /^Product information$/i }).getByRole('button', { name: /^Add to wishlist$/i }).click();
  await expect(page.getByRole('heading', { name: /^Sign in to continue$/i })).toBeVisible();
});
