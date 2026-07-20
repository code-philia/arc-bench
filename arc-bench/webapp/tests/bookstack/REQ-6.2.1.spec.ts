import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.2.1
// fixtures: sample_book, sample_page, sample_chapter, draft_page

test('REQ-6.2.1: Create Chapter', async ({ page }) => {
  await h.openChapterCreation(page);
  await h.fillChapterForm(page);
  await h.clickNamed(page, /Save Chapter/i);
  await h.expectTextsVisible(page, [h.FIXTURES.chapter.name]);
});
