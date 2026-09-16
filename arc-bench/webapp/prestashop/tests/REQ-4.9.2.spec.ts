import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.9.2
// fixtures: products.detail

test('REQ-4.9.2: Add Review', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await page.getByRole('button', { name: /^Reviews \(\d+\)$/i }).click();
  await page.getByRole('button', { name: /^Write a review$/i }).click();
  await expect(page.getByRole('heading', { name: /^Sign in to continue$/i })).toBeVisible();
});
