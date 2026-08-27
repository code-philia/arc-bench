import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.4.1
// fixtures: book_5_4_1

test('REQ-5.4.1: Save Book Edits', async ({ page }) => {
  await h.openBookDetailsFromList(page, h.FIXTURES.books.editSave.name);
  await h.clickNamed(page, /^Edit$/i);
  await h.fillBookForm(page, h.FIXTURES.books.editSave, 'edit');
  await h.clickNamed(page, /Save Book/i);
  await h.expectTextsVisible(page, [h.FIXTURES.books.editSave.updatedName]);
});
