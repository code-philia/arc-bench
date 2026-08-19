import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.2.3
// fixtures: public_homepage

test('REQ-2.2.3: Click Carousel to Navigate', async ({ page }) => {
  await h.openHome(page);
  await h.clickFirstAvailable(page, [[/shop now/i, /discover/i, /carousel/i]]);
  await h.expectTextsVisible(page, [/product|sale|category/i]);
});
