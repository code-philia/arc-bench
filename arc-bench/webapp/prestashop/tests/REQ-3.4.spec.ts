import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.4
// fixtures: category_listing

test('REQ-3.4: Subcategory Navigation', async ({ page }) => {
  await h.openCategoryPage(page);
  const subcategories = page.getByRole('region', { name: /^Subcategories$/i });
  await subcategories.getByRole('link', { name: /^Women$/i }).click();
  await expect(page.getByRole('heading', { name: /^Women$/i })).toBeVisible();
  await expect(page.getByRole('combobox', { name: /^Sort by$/i })).toBeVisible();
});
