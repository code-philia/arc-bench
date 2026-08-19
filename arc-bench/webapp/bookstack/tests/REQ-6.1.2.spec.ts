import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.1.2
// fixtures: sample_book, sample_page, sample_chapter, draft_page

test('REQ-6.1.2: Save Draft', async ({ page }) => {
  await h.openPageEditor(page);
  await h.fillPageEditor(page);
  await h.clickNamed(page, /Save Draft/i);
  await h.returnHomeByLogo(page);
  await h.expectTextsVisible(page, ['My Recent Drafts', h.FIXTURES.page.name]);
});
