import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.1
// fixtures: public_homepage, category_catalog

test('REQ-3.1: Enter Category Page', async ({ page }) => {
  await h.openCategoryPage(page);
  await expect(page.getByRole('heading', { name: /^Men$/i })).toBeVisible();
  await expect(page.getByRole('combobox', { name: /^Sort by$/i })).toBeVisible();
  await expect(page.getByText(/^Showing /i)).toBeVisible();
});
