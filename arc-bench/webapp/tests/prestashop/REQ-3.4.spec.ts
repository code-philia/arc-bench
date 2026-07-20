import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.4
// fixtures: category_listing

test('REQ-3.4: Subcategory Navigation', async ({ page }) => {
  await h.openCategoryPage(page);
  await h.clickFirstAvailable(page, [[/women/i]]);
  await h.expectTextsVisible(page, [/women/i, /sort by/i]);
});
