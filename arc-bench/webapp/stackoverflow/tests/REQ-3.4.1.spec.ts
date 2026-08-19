import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.4.1
// fixtures: registered_user, owned_question

test('REQ-3.4.1: Enter Edit Mode', async ({ page }) => {
  await h.openQuestionEdit(page);
  await h.expectTextsVisible(page, [/edit question/i, /title/i, /body/i, /tags/i]);
});
