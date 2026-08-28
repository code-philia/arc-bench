import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3
// fixtures: accounts.answerAcceptOwner, questions.acceptedAnswer

test('REQ-4.3: Accepted Answer Selection', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.answerAcceptOwner);
  await h.openQuestionDetail(page, h.FIXTURES.questions.acceptedAnswer);
  await h.clickAnswerAction(page, [/accept answer|accepted/i]);
  await h.expectTextsVisible(page, [/accepted/i, /green/i]);
});
