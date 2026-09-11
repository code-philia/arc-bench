import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.1.2
// fixtures: book_6_1_2

test('REQ-6.1.2: Save Draft', async ({ page }) => {
  await h.openPageEditor(page, h.FIXTURES.books.draftSave.name);
  await h.fillPageEditor(page, h.FIXTURES.pages.draft);
  await h.clickNamed(page, /Save Draft/i);
  await h.returnHomeByLogo(page);
  await h.expectTextsVisible(page, ['My Recent Drafts', h.FIXTURES.pages.draft.name]);
});
