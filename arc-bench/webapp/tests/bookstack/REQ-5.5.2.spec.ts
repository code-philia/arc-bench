import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.5.2
// fixtures: sample_book, editable_book

test('REQ-5.5.2: Cancel Delete Book', async ({ page }) => {
  await h.openBookDetailsFromList(page);
  await h.clickNamed(page, /^Delete$/i);
  await h.clickNamed(page, /^Cancel$/i);
  await h.expectTextsVisible(page, [h.FIXTURES.book.name]);
});
