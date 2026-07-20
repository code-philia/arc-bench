import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.5.1
// fixtures: sample_book, editable_book

test('REQ-5.5.1: Confirm Delete Book', async ({ page }) => {
  await h.openBookDetailsFromList(page);
  await h.clickNamed(page, /^Delete$/i);
  await h.clickNamed(page, /Confirm|Delete/i);
  await h.expectTextsVisible(page, [/Books/i]);
});
