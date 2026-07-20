import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.1
// fixtures: public_homepage, category_catalog

test('REQ-3.1: Enter Category Page', async ({ page }) => {
  await h.openCategoryPage(page);
  await h.expectTextsVisible(page, [/men/i, /sort by/i, /showing/i]);
});
