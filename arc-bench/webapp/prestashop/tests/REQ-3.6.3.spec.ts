import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.6.3
// fixtures: category_listing, filterable_catalog

test('REQ-3.6.3: Filter by Price Range', async ({ page }) => {
  await h.openCategoryPage(page);
  await h.fillField(page, [/price/i], '20');
  await h.expectTextsVisible(page, [/€|\$/i]);
});
