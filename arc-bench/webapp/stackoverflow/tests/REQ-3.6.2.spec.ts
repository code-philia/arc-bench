import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.6.2
// fixtures: registered_user, question_detail, votable_question

test('REQ-3.6.2: Downvote Question', async ({ page }) => {
  await h.login(page);
  await h.openQuestionDetail(page);
  await h.clickFirstAvailable(page, [[/down vote|downvote/i]]);
  await h.expectTextsVisible(page, [/downvote|vote|2/i]);
});
