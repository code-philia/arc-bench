import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3
// fixtures: products.detail

test('REQ-4.3: Product Basic Info', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await h.expectTextsVisible(page, [h.FIXTURES.products.detail.name, /€|\$/i, /tax/i, /20%/i, /description/i]);
});
