import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.2
// fixtures: sample_shelf, sample_book

test('REQ-5.2.2: Enter Book Details Page through Shelf Details Page', async ({ page }) => {
  await h.openBookDetailsFromShelf(page);
  await h.expectTextsVisible(page, [h.FIXTURES.book.name]);
});
