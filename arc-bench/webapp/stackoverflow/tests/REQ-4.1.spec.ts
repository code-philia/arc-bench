import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1
// fixtures: accounts.answerSubmitter, questions.answerSubmission

test('REQ-4.1: Answer Submission (Your Answer)', async ({ page }) => {
  await h.openAnswerEditor(page, h.FIXTURES.accounts.answerSubmitter, h.FIXTURES.questions.answerSubmission);
  await h.expectTextsVisible(page, [/your answer/i, /body/i]);
  await h.fillMarkdownBody(page, h.FIXTURES.answer.body);
  await h.clickFirstAvailable(page, [[/post your answer/i, /^post answer$/i]]);
  await h.expectTextsVisible(page, [/edited|score|answer/i]);
});
