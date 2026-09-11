import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.10
// fixtures: products.detail

test('REQ-4.10: Recently Viewed', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await h.expectTextsVisible(page, [/recently viewed/i, /product/i]);
});
