import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.3
// fixtures: accounts.answerValidationUser, questions.answerValidation

test('REQ-4.5.3: Cancel Answer Editing', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.answerValidationUser);
  await h.openQuestionDetail(page, h.FIXTURES.questions.answerValidation);
  await h.clickAnswerAction(page, [/^edit$/i]);
  await h.fillMarkdownBody(page, h.FIXTURES.answer.updatedBody);
  await h.clickFirstAvailable(page, [[/^cancel$/i]]);
  await h.expectTextAbsent(page, h.FIXTURES.answer.updatedBody);
});
