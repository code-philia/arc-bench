import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.4.4
// fixtures: registered_user, owned_question

test('REQ-3.4.4: Edit Summary and Revision History', async ({ page }) => {
  await h.openQuestionEdit(page);
  await h.fillField(page, [/edit summary/i], h.FIXTURES.question.summary);
  await h.clickFirstAvailable(page, [[/save edits/i]]);
  await h.expectTextsVisible(page, [/edited/i, /history|revision/i]);
});
