import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.5.2
// fixtures: book_5_5_2

test('REQ-5.5.2: Cancel Delete Book', async ({ page }) => {
  await h.openBookDetailsFromList(page, h.FIXTURES.books.deleteCancel.name);
  await h.clickNamed(page, /^Delete$/i);
  await h.clickNamed(page, /^Cancel$/i);
  await h.expectTextsVisible(page, [h.FIXTURES.books.deleteCancel.name]);
});
