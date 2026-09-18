import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.4.3
// fixtures: accounts.questionEditor, questions.editPreview

test('REQ-3.4.3: Markdown Body Editor with Preview', async ({ page }) => {
  await h.openQuestionEdit(page, h.FIXTURES.accounts.questionEditorBodyPreview, h.FIXTURES.questions.editBodyPreview);
  await h.fillMarkdownBody(page, h.FIXTURES.question.updatedBody);
  await h.expectTextsVisible(page, [/preview/i]);
});
