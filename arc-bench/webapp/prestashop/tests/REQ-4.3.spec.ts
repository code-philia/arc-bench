import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3
// fixtures: products.detail

test('REQ-4.3: Product Basic Info', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await expect(page.getByRole('heading', { name: /^Hummingbird detail t-shirt$/i })).toBeVisible();
  for (const text of ['€19.99', '€24.99', '-20%', 'Tax included · 20% VAT']) {
    await expect(page.getByText(text, { exact: true })).toBeVisible();
  }
  await expect(page.getByText(/^A soft, responsibly made cotton t-shirt/i).first()).toBeVisible();
});
