import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.4.5
// fixtures: accounts.questionEditor, questions.editPreview

test('REQ-3.4.5: Guidance Sidebar (How to Edit)', async ({ page }) => {
  await h.openQuestionEdit(page, h.FIXTURES.accounts.questionEditor, h.FIXTURES.questions.editPreview);
  await h.expectTextsVisible(page, [/how to edit/i, /best practices|checklist/i]);
});
