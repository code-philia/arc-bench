import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.1
// fixtures: accounts.commentEditUser, questions.commentEdit

test('REQ-5.2.1: Edit Comment', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.commentEditUser);
  await h.openQuestionDetail(page, h.FIXTURES.questions.commentEdit);
  await h.clickCommentAction(page, [/^edit$/i]);
  await h.expectTextsVisible(page, [/editable text field|comment/i]);
  await h.fillField(page, [/comment/i], h.FIXTURES.comment.updatedBody);
  await h.pressEnter(page, [/comment/i]);
  await h.expectTextsVisible(page, [/edited/i]);
});
