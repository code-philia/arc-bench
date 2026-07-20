import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.1.1
// fixtures: registered_user, question_detail, comment_thread

test('REQ-5.1.1: Post Comment', async ({ page }) => {
  await h.login(page);
  await h.openQuestionDetail(page);
  await h.clickFirstAvailable(page, [[/add a comment/i]]);
  await h.expectTextsVisible(page, [/comment/i]);
  await h.fillField(page, [/comment/i], h.FIXTURES.comment.body);
  await h.pressEnter(page, [/comment/i]);
  await h.expectTextsVisible(page, [/stack user/i, /comment/i]);
});
