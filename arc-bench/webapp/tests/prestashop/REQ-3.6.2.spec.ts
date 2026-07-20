import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.6.2
// fixtures: category_listing, filterable_catalog

test('REQ-3.6.2: Filter by Color', async ({ page }) => {
  await h.openCategoryPage(page);
  await h.clickFirstAvailable(page, [[/white/i]]);
  await h.expectTextsVisible(page, [/white/i]);
  await h.expectTextAbsent(page, h.FIXTURES.catalog.blackProduct);
});
