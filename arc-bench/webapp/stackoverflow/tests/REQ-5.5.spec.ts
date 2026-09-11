import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.5
// fixtures: accounts.commentReplyUser, questions.commentReply

test('REQ-5.5: Reply to Comments', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.commentReplyUser);
  await h.openQuestionDetail(page, h.FIXTURES.questions.commentReply);
  await h.clickCommentAction(page, [/^reply$/i]);
  await h.expectTextsVisible(page, [/reply/i]);
  await h.fillField(page, [/reply/i], h.FIXTURES.comment.reply);
  await h.clickFirstAvailable(page, [[/add reply/i, /^reply$/i]]);
  await h.expectTextsVisible(page, [/@helpful user/i]);
});
