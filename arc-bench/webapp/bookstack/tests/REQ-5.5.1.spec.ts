import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.5.1
// fixtures: book_5_5_1

test('REQ-5.5.1: Confirm Delete Book', async ({ page }) => {
  await h.openBookDetailsFromList(page, h.FIXTURES.books.deleteConfirm.name);
  await h.clickNamed(page, /^Delete$/i);
  await h.clickNamed(page, /Confirm|Delete/i);
  await h.expectTextsVisible(page, [/Books/i]);
});
