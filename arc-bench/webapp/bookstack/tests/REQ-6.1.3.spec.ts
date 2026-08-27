import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.1.3
// fixtures: book_6_1_3, draft_page_6_1_3

test('REQ-6.1.3: Delete Draft', async ({ page }) => {
  await h.openDraftPageEditor(page, h.FIXTURES.books.draftDelete.bookName, h.FIXTURES.books.draftDelete.pageName);
  await h.clickNamed(page, /Delete Draft/i);
  await h.clickNamed(page, /Confirm|Delete/i);
  await h.expectTextsVisible(page, [h.FIXTURES.books.draftDelete.bookName]);
});
