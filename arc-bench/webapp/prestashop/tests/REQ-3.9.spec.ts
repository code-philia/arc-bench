import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.9
// fixtures: category_listing, sortable_catalog

test('REQ-3.9: Pagination', async ({ page }) => {
  await h.openCategoryPage(page);
  await page.getByRole('button', { name: /^2$/i }).click();
  await expect(page.getByText(/^Showing 13-/i)).toBeVisible();
});
