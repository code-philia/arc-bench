import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.4.1
// fixtures: accounts.questionEditor, questions.editPreview

test('REQ-3.4.1: Enter Edit Mode', async ({ page }) => {
  await h.openQuestionEdit(page, h.FIXTURES.accounts.questionEditorMode, h.FIXTURES.questions.editMode);
  await expect(page.getByRole('textbox', { name: /^Title$/i })).toHaveValue(h.FIXTURES.questions.editMode.title);
  await expect(page.getByRole('textbox', { name: /^Body$/i })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /^Tags$/i })).toBeVisible();
});
