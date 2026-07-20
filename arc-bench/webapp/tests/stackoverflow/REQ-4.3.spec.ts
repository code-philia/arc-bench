import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3
// fixtures: registered_user, question_owner, answer_thread

test('REQ-4.3: Accepted Answer Selection', async ({ page }) => {
  await h.login(page);
  await h.openQuestionDetail(page);
  await h.clickFirstAvailable(page, [[/accept answer|accepted/i]]);
  await h.expectTextsVisible(page, [/accepted/i, /green/i]);
});
