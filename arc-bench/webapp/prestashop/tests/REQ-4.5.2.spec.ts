import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.2
// fixtures: products.detail

test('REQ-4.5.2: Decrease Quantity', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await page.getByRole('button', { name: /^Decrease quantity$/i }).click();
  await expect(page.getByRole('spinbutton', { name: /^Quantity$/i })).toHaveValue('1');
});
