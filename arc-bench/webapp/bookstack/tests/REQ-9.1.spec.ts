import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.1
// fixtures: book_9_1

test('REQ-9.1: Quick Navigation from Recently Updated', async ({ page }) => {
  await h.openPageEditor(page, h.FIXTURES.books.recentlyUpdated.name);
  await h.fillPageEditor(page, h.FIXTURES.pages.recentlyUpdated);
  await h.clickNamed(page, /Save Page/i);
  await h.returnHomeByLogo(page);
  await h.clickNamed(page, h.FIXTURES.pages.recentlyUpdated.name);
  await h.expectTextsVisible(page, [h.FIXTURES.pages.recentlyUpdated.name]);
});
