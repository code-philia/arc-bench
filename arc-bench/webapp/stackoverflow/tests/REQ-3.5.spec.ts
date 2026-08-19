import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5
// fixtures: registered_user, owned_question

test('REQ-3.5: Delete Question', async ({ page }) => {
  await h.login(page);
  await h.openQuestionDetail(page);
  await h.clickFirstAvailable(page, [[/^delete$/i]]);
  await h.expectTextsVisible(page, [/deletion implications|are you sure|delete question/i]);
  await h.clickFirstAvailable(page, [[/confirm deletion|delete/i]]);
  await h.expectHomepage(page);
});
