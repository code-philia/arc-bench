import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.3.2
// fixtures: book_6_3_2, page_6_3_2

test('REQ-6.3.2: Redirect to Page Edit Page', async ({ page }) => {
  await h.openPageReading(page, h.FIXTURES.books.pageEdit.name, h.FIXTURES.books.pageEdit.pageName);
  await h.clickNamed(page, /^Edit$/i);
  await h.expectTextsVisible(page, [/Save Page/i]);
});
