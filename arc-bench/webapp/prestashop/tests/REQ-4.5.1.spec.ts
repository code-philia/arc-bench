import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.1
// fixtures: products.detail

test('REQ-4.5.1: Increase Quantity', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await page.getByRole('button', { name: /^Increase quantity$/i }).click();
  await expect(page.getByRole('spinbutton', { name: /^Quantity$/i })).toHaveValue('2');
});
