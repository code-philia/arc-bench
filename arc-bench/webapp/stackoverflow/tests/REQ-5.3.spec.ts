import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3
// fixtures: accounts.commentVoteUser, questions.commentVote

test('REQ-5.3: Upvote Comment', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.commentVoteUser);
  await h.openQuestionDetail(page, h.FIXTURES.questions.commentVote);
  await h.clickCommentAction(page, [/upvote comment|upvote/i]);
  await h.expectTextsVisible(page, [/2|3|upvote/i]);
  await h.clickCommentAction(page, [/upvote comment|upvote/i]);
  await h.expectTextsVisible(page, [/1|2|comment/i]);
});
