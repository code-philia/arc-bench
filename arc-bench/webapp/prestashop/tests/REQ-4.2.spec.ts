import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2
// fixtures: products.detail

test('REQ-4.2: Product Image Area', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await h.expectTextsVisible(page, [/image/i, /zoom/i]);
});
