import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.3
// fixtures: registered_user, tags_catalog, tagged_questions

test('REQ-6.3: Follow Tags', async ({ page }) => {
  await h.login(page);
  await h.openTagDetail(page);
  await h.clickFirstAvailable(page, [[/watch tag/i]]);
  await h.expectTextsVisible(page, [/watched|unwatch tag/i]);
  await h.clickFirstAvailable(page, [[/unwatch tag/i]]);
  await h.expectTextsVisible(page, [/watch tag/i]);
});
