import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.6.1
// fixtures: sample_shelf, sample_book

test('REQ-5.6.1: Fill out and Save Book with Shelf', async ({ page }) => {
  await h.openBookCreationFromShelf(page);
  await h.fillBookForm(page, 'create');
  await h.clickNamed(page, /Save Book/i);
  await h.expectTextsVisible(page, [h.FIXTURES.book.name, h.FIXTURES.shelf.name]);
});
