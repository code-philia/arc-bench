import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1
// fixtures: products.detail

test('REQ-4.1: Enter Product Detail Page', async ({ page }) => {
  await h.openCategoryPage(page);
  await page.getByRole('link', { name: /^Hummingbird detail t-shirt$/i }).click();
  await expect(page.getByRole('heading', { name: /^Hummingbird detail t-shirt$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^ADD TO CART$/i })).toBeVisible();
});
