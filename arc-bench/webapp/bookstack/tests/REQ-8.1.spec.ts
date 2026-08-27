import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.1
// fixtures: book_8_1

test('REQ-8.1: Favorite Items', async ({ page }) => {
  await h.openBookDetailsFromList(page, h.FIXTURES.books.favorite.name);
  await h.clickNamed(page, /^Favorite$/i);
  await h.expectTextsVisible(page, [/Unfavorite/i]);
});
