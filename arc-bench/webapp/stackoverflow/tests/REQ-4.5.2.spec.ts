import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.2
// fixtures: accounts.answerValidationUser, questions.answerValidation

test('REQ-4.5.2: Empty Answer Body', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.answerValidationUser);
  await h.openQuestionDetail(page, h.FIXTURES.questions.answerValidation);
  await h.clickAnswerAction(page, [/^edit$/i]);
  await h.fillMarkdownBody(page, '');
  await h.clickFirstAvailable(page, [[/save edits/i]]);
  await h.expectTextsVisible(page, [/body cannot be empty/i]);
});
