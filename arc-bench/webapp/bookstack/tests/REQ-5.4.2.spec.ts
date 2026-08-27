import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.4.2
// fixtures: book_5_4_2

test('REQ-5.4.2: Cancel Book Edits', async ({ page }) => {
  await h.openBookDetailsFromList(page, h.FIXTURES.books.editCancel.name);
  await h.clickNamed(page, /^Edit$/i);
  await h.clickNamed(page, /^Cancel$/i);
  await h.expectTextsVisible(page, [h.FIXTURES.books.editCancel.name]);
});
