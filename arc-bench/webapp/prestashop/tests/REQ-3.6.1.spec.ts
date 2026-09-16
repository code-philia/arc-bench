import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.6.1
// fixtures: category_listing, filterable_catalog

test('REQ-3.6.1: Filter by Availability', async ({ page }) => {
  await h.openCategoryPage(page);
  await page.getByRole('checkbox', { name: /^In stock$/i }).check();
  await expect(page.getByRole('article').filter({ hasText: 'White t-shirt' })).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Black mug' })).toHaveCount(0);
});
