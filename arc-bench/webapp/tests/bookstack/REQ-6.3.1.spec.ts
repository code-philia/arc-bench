import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.3.1
// fixtures: sample_book, sample_page, sample_chapter, draft_page

test('REQ-6.3.1: Enter Page Reading Page', async ({ page }) => {
  await h.openPageReading(page);
  await h.expectTextsVisible(page, [h.FIXTURES.page.name]);
});
