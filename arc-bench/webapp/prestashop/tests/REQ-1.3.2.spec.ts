import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.3.2
// fixtures: public_homepage, category_catalog

test('REQ-1.3.2: Enter Subcategory', async ({ page }) => {
  await h.openHome(page);
  await h.openCategoryMenu(page);
  await page.getByRole('link', { name: /^Men$/i }).first().click();
  await expect(page.getByRole('heading', { name: /^Men$/i })).toBeVisible();
  await expect(page.getByRole('combobox', { name: /^Sort by$/i })).toBeVisible();
});
