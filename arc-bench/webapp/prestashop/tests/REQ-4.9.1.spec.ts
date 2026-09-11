import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.9.1
// fixtures: products.detail

test('REQ-4.9.1: View Review List', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await h.expectTextsVisible(page, [/review/i, /rating/i, /average/i]);
});
