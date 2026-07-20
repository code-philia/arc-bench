import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5.2
// fixtures: category_listing

test('REQ-3.5.2: Hover to Show Action Buttons', async ({ page }) => {
  await h.openCategoryPage(page);
  await h.hoverNamed(page, [h.FIXTURES.catalog.popularProduct]);
  await h.expectTextsVisible(page, [/quick view/i, /wishlist/i, /color/i]);
});
