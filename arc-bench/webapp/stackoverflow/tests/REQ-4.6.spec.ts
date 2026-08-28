import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.6
// fixtures: accounts.answerDeleteUser, questions.answerDelete

test('REQ-4.6: Delete Answer', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.answerDeleteUser);
  await h.openQuestionDetail(page, h.FIXTURES.questions.answerDelete);
  await h.clickAnswerAction(page, [/^delete$/i]);
  await h.expectTextsVisible(page, [/consequences|confirm deletion/i]);
  await h.clickFirstAvailable(page, [[/confirm deletion|delete/i]]);
  await h.expectTextAbsent(page, h.FIXTURES.answer.body);
});
