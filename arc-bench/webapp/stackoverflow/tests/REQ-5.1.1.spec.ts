import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.1.1
// fixtures: accounts.questionCommentUser, questions.questionComment

test('REQ-5.1.1: Post Comment', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.questionCommentUser);
  await h.openQuestionDetail(page, h.FIXTURES.questions.questionComment);
  await h.clickFirstAvailable(page, [[/add a comment/i]]);
  await h.expectTextsVisible(page, [/comment/i]);
  await h.fillField(page, [/comment/i], h.FIXTURES.comment.body);
  await h.pressEnter(page, [/comment/i]);
  await h.expectTextsVisible(page, [/stack user/i, /comment/i]);
});
