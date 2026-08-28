import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.2
// fixtures: accounts.commentDeleteUser, questions.commentDelete

test('REQ-5.2.2: Delete Comment', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.commentDeleteUser);
  await h.openQuestionDetail(page, h.FIXTURES.questions.commentDelete);
  await h.clickCommentAction(page, [/^delete$/i]);
  await h.expectTextAbsent(page, h.FIXTURES.comment.body);
});
