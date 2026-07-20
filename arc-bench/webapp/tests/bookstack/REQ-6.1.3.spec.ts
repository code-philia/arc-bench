import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.1.3
// fixtures: sample_book, sample_page, sample_chapter, draft_page

test('REQ-6.1.3: Delete Draft', async ({ page }) => {
  await h.openPageEditor(page);
  await h.clickNamed(page, /Delete Draft/i);
  await h.clickNamed(page, /Confirm|Delete/i);
  await h.expectTextsVisible(page, [h.FIXTURES.book.name]);
});
