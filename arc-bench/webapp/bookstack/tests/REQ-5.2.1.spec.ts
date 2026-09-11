import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.1
// fixtures: book_5_2_1

test('REQ-5.2.1: Enter Book Details Page through Book List Page', async ({ page }) => {
  await h.openBookDetailsFromList(page, h.FIXTURES.books.detailsFromList.name);
  await h.expectTextsVisible(page, [h.FIXTURES.books.detailsFromList.name]);
});
