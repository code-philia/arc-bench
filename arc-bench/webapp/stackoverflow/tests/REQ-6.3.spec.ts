import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.3
// fixtures: accounts.tagWatcher, tags.catalog, questions.taggedPython

test('REQ-6.3: Follow Tags', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.tagWatcher);
  await h.openTagDetail(page, h.FIXTURES.tags.primary);
  await h.clickFirstAvailable(page, [[/watch tag/i]]);
  await h.expectTextsVisible(page, [/watched|unwatch tag/i]);
  await h.clickFirstAvailable(page, [[/unwatch tag/i]]);
  await h.expectTextsVisible(page, [/watch tag/i]);
});
