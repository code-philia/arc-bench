import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.2
// fixtures: category_listing

test('REQ-3.2.2: Navigate Back via Breadcrumb', async ({ page }) => {
  await h.openCategoryPage(page);
  await page.getByRole('navigation', { name: /^Breadcrumb$/i }).getByRole('link', { name: /^Clothes$/i }).click();
  await expect(page.getByRole('heading', { name: /^Clothes$/i })).toBeVisible();
});
