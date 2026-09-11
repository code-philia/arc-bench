import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.3
// fixtures: public_homepage, products.detail

test('REQ-2.3: Popular Products Section', async ({ page }) => {
  await h.openHome(page);
  await h.clickFirstAvailable(page, [[h.FIXTURES.catalog.popularProduct]]);
  await h.expectTextsVisible(page, [h.FIXTURES.catalog.popularProduct, /add to cart/i]);
});
