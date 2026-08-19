import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.7
// fixtures: category_listing, sortable_catalog

test('REQ-3.7: Sort Function', async ({ page }) => {
  await h.openCategoryPage(page);
  await h.clickFirstAvailable(page, [[/sort by/i]]);
  await h.expectTextsVisible(page, [/price, low to high/i]);
  await h.clickFirstAvailable(page, [[/price, low to high/i]]);
  await h.expectTextsVisible(page, [/€|\$/i]);
});
