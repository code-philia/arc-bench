import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.4.2
// fixtures: sample_book, editable_book

test('REQ-5.4.2: Cancel Book Edits', async ({ page }) => {
  await h.openBookDetailsFromList(page);
  await h.clickNamed(page, /^Edit$/i);
  await h.clickNamed(page, /^Cancel$/i);
  await h.expectTextsVisible(page, [h.FIXTURES.book.name]);
});
