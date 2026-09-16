import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.6.3
// fixtures: category_listing, filterable_catalog

test('REQ-3.6.3: Filter by Price Range', async ({ page }) => {
  await h.openCategoryPage(page);
  await page.getByRole('slider', { name: /^Maximum price$/i }).fill('20');
  await expect(page.getByRole('article').filter({ hasText: 'White t-shirt' })).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Printed summer shirt' })).toHaveCount(0);
});
