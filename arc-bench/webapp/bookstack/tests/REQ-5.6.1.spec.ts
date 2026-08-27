import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.6.1
// fixtures: shelf_5_6_1

test('REQ-5.6.1: Fill out and Save Book with Shelf', async ({ page }) => {
  await h.openBookCreationFromShelf(page, h.FIXTURES.books.createFromShelf.shelfName);
  await h.fillBookForm(page, h.FIXTURES.books.createFromShelf, 'create');
  await h.clickNamed(page, /Save Book/i);
  await h.expectTextsVisible(page, [h.FIXTURES.books.createFromShelf.name, h.FIXTURES.books.createFromShelf.shelfName]);
});
