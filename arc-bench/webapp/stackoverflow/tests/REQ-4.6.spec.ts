import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.6
// fixtures: registered_user, own_answer

test('REQ-4.6: Delete Answer', async ({ page }) => {
  await h.login(page);
  await h.openQuestionDetail(page);
  await h.clickFirstAvailable(page, [[/^delete$/i]]);
  await h.expectTextsVisible(page, [/consequences|confirm deletion/i]);
  await h.clickFirstAvailable(page, [[/confirm deletion|delete/i]]);
  await h.expectTextAbsent(page, h.FIXTURES.answer.body);
});
