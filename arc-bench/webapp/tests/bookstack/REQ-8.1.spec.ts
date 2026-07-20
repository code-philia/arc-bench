import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.1
// fixtures: favorite_content

test('REQ-8.1: Favorite Items', async ({ page }) => {
  await h.openBookDetailsFromList(page);
  await h.clickNamed(page, /^Favorite$/i);
  await h.expectTextsVisible(page, [/Unfavorite/i]);
});
