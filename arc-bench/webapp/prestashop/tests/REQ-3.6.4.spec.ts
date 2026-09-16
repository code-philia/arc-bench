import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.6.4
// fixtures: category_listing, filterable_catalog

test('REQ-3.6.4: Clear All Filters', async ({ page }) => {
  await h.openCategoryPage(page);
  await page.getByRole('checkbox', { name: /^In stock$/i }).check();
  await page.getByRole('button', { name: /^Clear all$/i }).click();
  await expect(page.getByRole('article').filter({ hasText: 'White t-shirt' })).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Black mug' })).toBeVisible();
});
