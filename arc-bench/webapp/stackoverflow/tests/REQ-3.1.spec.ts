import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.1
// fixtures: homepage_questions

test('REQ-3.1: View Question List', async ({ page }) => {
  await h.openQuestionList(page);
  await h.expectTextsVisible(page, [/votes/i, /answers/i, /views/i, /tags/i]);
});
