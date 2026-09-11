import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.6.2
// fixtures: accounts.questionDownvoter, questions.downvote

test('REQ-3.6.2: Downvote Question', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.questionDownvoter);
  await h.openQuestionDetail(page, h.FIXTURES.questions.downvote);
  await h.clickFirstAvailable(page, [[/down vote|downvote/i]]);
  await h.expectTextsVisible(page, [/downvote|vote|2/i]);
});
