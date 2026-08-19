import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.3.2
// fixtures: sample_book, sample_page, sample_chapter, draft_page

test('REQ-6.3.2: Redirect to Page Edit Page', async ({ page }) => {
  await h.openPageReading(page);
  await h.clickNamed(page, /^Edit$/i);
  await h.expectTextsVisible(page, [/Save Page/i]);
});
