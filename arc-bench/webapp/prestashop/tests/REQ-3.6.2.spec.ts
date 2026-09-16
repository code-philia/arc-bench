import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.6.2
// fixtures: category_listing, filterable_catalog

test('REQ-3.6.2: Filter by Color', async ({ page }) => {
  await h.openCategoryPage(page);
  await page.getByRole('radio', { name: /^White$/i }).check();
  await expect(page.getByRole('radio', { name: /^White$/i })).toBeChecked();
  await expect(page.getByRole('article').filter({ hasText: h.FIXTURES.catalog.blackProduct })).toHaveCount(0);
});
