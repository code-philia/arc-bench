import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.4.5
// fixtures: registered_user, owned_question

test('REQ-3.4.5: Guidance Sidebar (How to Edit)', async ({ page }) => {
  await h.openQuestionEdit(page);
  await h.expectTextsVisible(page, [/how to edit/i, /best practices|checklist/i]);
});
