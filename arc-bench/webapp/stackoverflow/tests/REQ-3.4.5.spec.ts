import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.4.5
// fixtures: accounts.questionEditor, questions.editPreview

test('REQ-3.4.5: Guidance Sidebar (How to Edit)', async ({ page }) => {
  await h.openQuestionEdit(page, h.FIXTURES.accounts.questionEditorGuidance, h.FIXTURES.questions.editGuidance);
  await h.expectTextsVisible(page, [/how to edit/i, /best practices|checklist/i]);
});
