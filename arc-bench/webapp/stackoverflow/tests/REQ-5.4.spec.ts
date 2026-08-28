import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.4
// fixtures: accounts.answerCommentUser, questions.answerComment

test('REQ-5.4: Add Comment on Answer', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.answerCommentUser);
  await h.openQuestionDetail(page, h.FIXTURES.questions.answerComment);
  await h.clickAnswerAction(page, [/add a comment/i]);
  await h.fillField(page, [/comment/i], h.FIXTURES.comment.body);
  await h.pressEnter(page, [/comment/i]);
  await h.expectTextsVisible(page, [/stack user/i, /timestamp|comment/i]);
});
