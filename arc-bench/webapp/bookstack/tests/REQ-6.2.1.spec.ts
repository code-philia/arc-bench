import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.2.1
// fixtures: book_6_2_1

test('REQ-6.2.1: Create Chapter', async ({ page }) => {
  await h.openChapterCreation(page, h.FIXTURES.books.chapterCreate.name);
  await h.fillChapterForm(page, h.FIXTURES.chapter);
  await h.clickNamed(page, /Save Chapter/i);
  await h.expectTextsVisible(page, [h.FIXTURES.chapter.name]);
});
