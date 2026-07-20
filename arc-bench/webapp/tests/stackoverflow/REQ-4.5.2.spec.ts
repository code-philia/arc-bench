import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.2
// fixtures: registered_user, own_answer

test('REQ-4.5.2: Empty Answer Body', async ({ page }) => {
  await h.login(page);
  await h.openQuestionDetail(page);
  await h.clickFirstAvailable(page, [[/^edit$/i]]);
  await h.fillMarkdownBody(page, '');
  await h.clickFirstAvailable(page, [[/save edits/i]]);
  await h.expectTextsVisible(page, [/body cannot be empty/i]);
});
