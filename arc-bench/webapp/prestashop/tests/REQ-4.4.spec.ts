import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4
// fixtures: products.detail

test('REQ-4.4: Variant Selection', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await h.chooseOption(page, [/size/i], h.FIXTURES.products.detail.size!);
  await h.clickFirstAvailable(page, [[h.FIXTURES.products.detail.color!]]);
  await h.expectTextsVisible(page, [h.FIXTURES.products.detail.color!, h.FIXTURES.products.detail.size!]);
});
