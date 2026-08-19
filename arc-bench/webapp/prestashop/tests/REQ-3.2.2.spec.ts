import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.2
// fixtures: category_listing

test('REQ-3.2.2: Navigate Back via Breadcrumb', async ({ page }) => {
  await h.openCategoryPage(page);
  await h.clickFirstAvailable(page, [[/clothes/i]]);
  await h.expectTextsVisible(page, [/clothes/i]);
});
