import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.1
// fixtures: accounts.answerEditUser, questions.successfulAnswerEdit

test('REQ-4.5.1: Successfully Edit Answer', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.answerEditUser);
  await h.openQuestionDetail(page, h.FIXTURES.questions.successfulAnswerEdit);
  await h.clickAnswerAction(page, [/^edit$/i]);
  await h.expectTextsVisible(page, [/save edits/i, /edit summary/i]);
  await h.fillMarkdownBody(page, h.FIXTURES.answer.updatedBody);
  await h.fillField(page, [/edit summary/i], h.FIXTURES.answer.summary);
  await h.clickFirstAvailable(page, [[/save edits/i]]);
  await h.expectTextsVisible(page, [/edited/i]);
});
