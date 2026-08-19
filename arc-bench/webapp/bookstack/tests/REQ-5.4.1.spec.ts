import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.4.1
// fixtures: sample_book, editable_book

test('REQ-5.4.1: Save Book Edits', async ({ page }) => {
  await h.openBookDetailsFromList(page);
  await h.clickNamed(page, /^Edit$/i);
  await h.fillBookForm(page, 'edit');
  await h.clickNamed(page, /Save Book/i);
  await h.expectTextsVisible(page, [h.FIXTURES.book.updatedName]);
});
