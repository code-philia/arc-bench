import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1
// fixtures: products.detail

test('REQ-4.1: Enter Product Detail Page', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await h.expectTextsVisible(page, [h.FIXTURES.products.detail.name, /add to cart/i]);
});
