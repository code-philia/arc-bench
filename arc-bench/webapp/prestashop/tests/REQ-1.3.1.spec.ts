import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.3.1
// fixtures: public_homepage, category_catalog

test('REQ-1.3.1: Expand Category Menu', async ({ page }) => {
  await h.openHome(page);
  await h.openCategoryMenu(page);
  await expect(page.getByRole('link', { name: /^Men$/i }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /^Women$/i }).first()).toBeVisible();
});
