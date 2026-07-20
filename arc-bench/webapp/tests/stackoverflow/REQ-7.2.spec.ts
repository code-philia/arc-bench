import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.2
// fixtures: homepage_questions

test('REQ-7.2: Filter Questions by Tab', async ({ page }) => {
  await h.openQuestionList(page);
  await h.clickFirstAvailable(page, [[/newest/i]]);
  await h.expectTextsVisible(page, [/newest/i]);
  await h.clickFirstAvailable(page, [[/active/i]]);
  await h.expectTextsVisible(page, [/active/i]);
});
