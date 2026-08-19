import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.2
// fixtures: registered_user, own_comment

test('REQ-5.2.2: Delete Comment', async ({ page }) => {
  await h.login(page);
  await h.openQuestionDetail(page);
  await h.clickFirstAvailable(page, [[/^delete$/i]]);
  await h.expectTextAbsent(page, h.FIXTURES.comment.body);
});
