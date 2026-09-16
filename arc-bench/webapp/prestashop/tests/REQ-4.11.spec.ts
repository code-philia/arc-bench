import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.11
// fixtures: products.detail

test('REQ-4.11: Related Products', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  const related = page.getByRole('region', { name: /^Related products$/i });
  await expect(related).toBeVisible();
  await expect(related.getByRole('article').first()).toBeVisible();
});
