import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.3.2
// fixtures: public_homepage, category_catalog

test('REQ-1.3.2: Enter Subcategory', async ({ page }) => {
  await h.openHome(page);
  await h.openCategoryMenu(page);
  await h.clickFirstAvailable(page, [[/men/i]]);
  await h.expectTextsVisible(page, [/men/i, /sort by/i]);
});
