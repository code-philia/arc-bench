import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5.3
// fixtures: category_listing

test('REQ-3.5.3: Click to Enter Detail Page', async ({ page }) => {
  await h.openCategoryPage(page);
  await h.clickFirstAvailable(page, [[h.FIXTURES.catalog.popularProduct]]);
  await h.expectTextsVisible(page, [h.FIXTURES.catalog.popularProduct, /add to cart/i]);
});
