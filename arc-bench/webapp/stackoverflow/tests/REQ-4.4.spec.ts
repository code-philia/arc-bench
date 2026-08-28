import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4
// fixtures: questions.answerSorting

test('REQ-4.4: Answer List Controls & Sorting', async ({ page }) => {
  await h.openQuestionDetail(page, h.FIXTURES.questions.answerSorting);
  await h.expectTextsVisible(page, [/highest score/i, /trending/i, /date modified/i]);
  await h.clickFirstAvailable(page, [[/highest score/i]]);
  await h.expectTextsVisible(page, [/score/i]);
});
