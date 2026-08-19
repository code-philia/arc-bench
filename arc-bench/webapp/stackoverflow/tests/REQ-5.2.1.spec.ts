import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.1
// fixtures: registered_user, own_comment

test('REQ-5.2.1: Edit Comment', async ({ page }) => {
  await h.login(page);
  await h.openQuestionDetail(page);
  await h.clickFirstAvailable(page, [[/^edit$/i]]);
  await h.expectTextsVisible(page, [/editable text field|comment/i]);
  await h.fillField(page, [/comment/i], h.FIXTURES.comment.updatedBody);
  await h.pressEnter(page, [/comment/i]);
  await h.expectTextsVisible(page, [/edited/i]);
});
