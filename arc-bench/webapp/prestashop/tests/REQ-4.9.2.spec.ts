import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.9.2
// fixtures: products.detail

test('REQ-4.9.2: Add Review', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await h.clickFirstAvailable(page, [[/write your review/i, /review/i]]);
  await h.expectTextsVisible(page, [/login|sign in|review form/i]);
});
