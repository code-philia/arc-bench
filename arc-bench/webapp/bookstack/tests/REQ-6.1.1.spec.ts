import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.1.1
// fixtures: sample_book, sample_page, sample_chapter, draft_page

test('REQ-6.1.1: Save Page', async ({ page }) => {
  await h.openPageEditor(page);
  await h.fillPageEditor(page);
  await h.clickNamed(page, /Save Page/i);
  await h.expectTextsVisible(page, [h.FIXTURES.page.name]);
});
