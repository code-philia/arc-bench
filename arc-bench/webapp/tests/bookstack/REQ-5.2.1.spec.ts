import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.1
// fixtures: sample_shelf, sample_book

test('REQ-5.2.1: Enter Book Details Page through Book List Page', async ({ page }) => {
  await h.openBookDetailsFromList(page);
  await h.expectTextsVisible(page, [h.FIXTURES.book.name]);
});
