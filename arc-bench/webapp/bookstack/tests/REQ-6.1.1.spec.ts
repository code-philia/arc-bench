import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.1.1
// fixtures: book_6_1_1

test('REQ-6.1.1: Save Page', async ({ page }) => {
  await h.openPageEditor(page, h.FIXTURES.books.pageSave.name);
  await h.fillPageEditor(page, h.FIXTURES.pages.save);
  await h.clickNamed(page, /Save Page/i);
  await h.expectTextsVisible(page, [h.FIXTURES.pages.save.name]);
});
