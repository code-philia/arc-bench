import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.9.2
// fixtures: product_detail_product, registered_user, wishlist_state

test('REQ-4.9.2: Add Review', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.clickFirstAvailable(page, [[/write your review/i, /review/i]]);
  await h.expectTextsVisible(page, [/login|sign in|review form/i]);
});
