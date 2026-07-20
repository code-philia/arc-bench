import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.9
// fixtures: category_listing, sortable_catalog

test('REQ-3.9: Pagination', async ({ page }) => {
  await h.openCategoryPage(page);
  await h.clickFirstAvailable(page, [[/next/i, /^2$/i]]);
  await h.expectTextsVisible(page, [/showing/i]);
});
