import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.6.1
// fixtures: accounts.questionUpvoter, questions.upvote

test('REQ-3.6.1: Upvote Question', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.questionUpvoter);
  await h.openQuestionDetail(page, h.FIXTURES.questions.upvote);
  await h.clickFirstAvailable(page, [[/up vote|upvote/i]]);
  await h.expectTextsVisible(page, [/^8$/]);
  await h.clickFirstAvailable(page, [[/up vote|upvote/i]]);
  await h.expectTextsVisible(page, [/^7$/]);
});
