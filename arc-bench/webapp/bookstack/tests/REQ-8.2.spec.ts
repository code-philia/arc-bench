import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.2
// fixtures: favorite_content

test('REQ-8.2: Quick Navigation from Favorites', async ({ page }) => {
  await h.openBookDetailsFromList(page);
  await h.clickNamed(page, /^Favorite$/i);
  await h.returnHomeByLogo(page);
  await h.clickNamed(page, h.FIXTURES.book.name);
  await h.expectTextsVisible(page, [h.FIXTURES.book.name]);
});
