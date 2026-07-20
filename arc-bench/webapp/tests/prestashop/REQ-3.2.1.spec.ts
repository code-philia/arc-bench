import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.1
// fixtures: category_listing

test('REQ-3.2.1: View Breadcrumb Navigation', async ({ page }) => {
  await h.openCategoryPage(page);
  await h.expectTextsVisible(page, [/home/i, /clothes/i, /men/i]);
});
