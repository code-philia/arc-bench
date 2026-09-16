import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.8.2
// fixtures: products.detail

test('REQ-4.8.2: View Product Details Tab', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await page.getByRole('button', { name: /^Product Details$/i }).click();
  for (const label of ['Reference', 'Data sheet', 'Specific features']) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
});
