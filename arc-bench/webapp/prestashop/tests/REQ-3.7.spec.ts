import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.7
// fixtures: category_listing, sortable_catalog

test('REQ-3.7: Sort Function', async ({ page }) => {
  await h.openCategoryPage(page);
  await page.getByRole('combobox', { name: /^Sort by$/i }).selectOption({ label: 'Price, low to high' });
  const firstProduct = page.getByRole('article').first();
  await expect(firstProduct).toContainText('Black mug');
  await expect(firstProduct).toContainText('€11.90');
});
