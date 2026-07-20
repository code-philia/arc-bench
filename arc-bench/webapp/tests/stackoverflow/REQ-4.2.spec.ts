import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2
// fixtures: registered_user, answer_thread

test('REQ-4.2: Answer Evaluation (Voting)', async ({ page }) => {
  await h.login(page);
  await h.openQuestionDetail(page);
  await h.clickFirstAvailable(page, [[/answer upvote|upvote/i]]);
  await h.expectTextsVisible(page, [/score|reputation/i]);
});
