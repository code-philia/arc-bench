import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.8
// fixtures: category_listing, sortable_catalog

test('REQ-3.8: Product Count Display', async ({ page }) => {
  await h.openCategoryPage(page);
  await h.expectTextsVisible(page, [/showing/i, /item/i]);
});
