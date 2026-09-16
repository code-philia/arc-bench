import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4
// fixtures: products.detail

test('REQ-4.4: Variant Selection', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await page.getByRole('combobox', { name: /^Size$/i }).selectOption({ label: 'M' });
  const white = page.getByRole('button', { name: /^White$/i });
  await white.click();
  await expect(page.getByRole('combobox', { name: /^Size$/i })).toHaveValue('M');
  await expect(white).toHaveAttribute('aria-pressed', 'true');
});
