import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.6.4
// fixtures: category_listing, filterable_catalog

test('REQ-3.6.4: Clear All Filters', async ({ page }) => {
  await h.openCategoryPage(page);
  await h.setCheckbox(page, [/in stock/i], true);
  await h.clickFirstAvailable(page, [[/clear all/i]]);
  await h.expectTextsVisible(page, [h.FIXTURES.catalog.blackProduct, h.FIXTURES.catalog.whiteProduct]);
});
