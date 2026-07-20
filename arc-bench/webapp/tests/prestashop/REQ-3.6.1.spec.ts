import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.6.1
// fixtures: category_listing, filterable_catalog

test('REQ-3.6.1: Filter by Availability', async ({ page }) => {
  await h.openCategoryPage(page);
  await h.setCheckbox(page, [/in stock/i], true);
  await h.expectTextsVisible(page, [/in stock/i]);
  await h.expectUrlIncludes(page, /stock|in-stock|q=/i);
});
