import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3
// fixtures: registered_user, comment_thread

test('REQ-5.3: Upvote Comment', async ({ page }) => {
  await h.login(page);
  await h.openQuestionDetail(page);
  await h.clickFirstAvailable(page, [[/upvote comment|upvote/i]]);
  await h.expectTextsVisible(page, [/2|3|upvote/i]);
  await h.clickFirstAvailable(page, [[/upvote comment|upvote/i]]);
  await h.expectTextsVisible(page, [/1|2|comment/i]);
});
