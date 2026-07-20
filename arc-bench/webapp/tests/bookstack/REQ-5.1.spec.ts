import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.1
// fixtures: sample_book

test('REQ-5.1: View Books List', async ({ page }) => {
  await h.openBooks(page);
  await h.expectTextsVisible(page, [h.FIXTURES.book.name]);
});
