import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.4.4
// fixtures: accounts.questionEditor, questions.editSave

test('REQ-3.4.4: Edit Summary and Revision History', async ({ page }) => {
  await h.openQuestionEdit(page, h.FIXTURES.accounts.questionEditor, h.FIXTURES.questions.editSave);
  await expect(page.getByRole('combobox', { name: /^Rev$/i })).toBeVisible();
  const summary = page.getByRole('textbox', { name: /^Edit Summary$/i });
  await summary.fill(h.FIXTURES.question.summary);
  await expect(summary).toHaveValue(h.FIXTURES.question.summary);
});
