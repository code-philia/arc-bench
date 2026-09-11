import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.2
// fixtures: shelf_5_2_2, book_5_2_2

test('REQ-5.2.2: Enter Book Details Page through Shelf Details Page', async ({ page }) => {
  await h.openBookDetailsFromShelf(page, h.FIXTURES.books.detailsFromShelf.shelfName, h.FIXTURES.books.detailsFromShelf.name);
  await h.expectTextsVisible(page, [h.FIXTURES.books.detailsFromShelf.name]);
});
