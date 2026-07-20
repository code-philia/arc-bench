import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5.1
// fixtures: category_listing

test('REQ-3.5.1: View Product Cards', async ({ page }) => {
  await h.openCategoryPage(page);
  await h.expectTextsVisible(page, [h.FIXTURES.catalog.popularProduct, /€|\$/i, /sale/i]);
});
