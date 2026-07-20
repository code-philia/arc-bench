import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3
// fixtures: category_listing

test('REQ-3.3: Category Description', async ({ page }) => {
  await h.openCategoryPage(page);
  await h.expectTextsVisible(page, [/men/i, /products/i, /description/i]);
});
