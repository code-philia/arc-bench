import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.4.2
// fixtures: accounts.questionEditor, questions.editPreview

test('REQ-3.4.2: Title and Tags Editor', async ({ page }) => {
  await h.openQuestionEdit(page, h.FIXTURES.accounts.questionEditor, h.FIXTURES.questions.editPreview);
  await h.fillField(page, [/title/i], h.FIXTURES.question.newTitle);
  await h.fillField(page, [/tags/i], h.FIXTURES.question.tags[0]);
  await h.expectFieldValue(page, [/title/i], h.FIXTURES.question.newTitle);
});
