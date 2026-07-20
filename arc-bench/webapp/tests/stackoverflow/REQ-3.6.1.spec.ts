import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.6.1
// fixtures: registered_user, question_detail, votable_question

test('REQ-3.6.1: Upvote Question', async ({ page }) => {
  await h.login(page);
  await h.openQuestionDetail(page);
  await h.clickFirstAvailable(page, [[/up vote|upvote/i]]);
  await h.expectTextsVisible(page, [/saved|voted|highlight|10/i]);
  await h.clickFirstAvailable(page, [[/up vote|upvote/i]]);
  await h.expectTextsVisible(page, [/7|vote/i]);
});
