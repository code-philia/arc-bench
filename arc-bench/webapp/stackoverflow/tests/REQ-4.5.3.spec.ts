import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.3
// fixtures: registered_user, own_answer

test('REQ-4.5.3: Cancel Answer Editing', async ({ page }) => {
  await h.login(page);
  await h.openQuestionDetail(page);
  await h.clickFirstAvailable(page, [[/^edit$/i]]);
  await h.fillMarkdownBody(page, h.FIXTURES.answer.updatedBody);
  await h.clickFirstAvailable(page, [[/^cancel$/i]]);
  await h.expectTextAbsent(page, h.FIXTURES.answer.updatedBody);
});
