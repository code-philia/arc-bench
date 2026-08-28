import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.2
// fixtures: tags.catalog, questions.taggedPython

test('REQ-6.2: Tag Detail Page', async ({ page }) => {
  await h.openTagDetail(page);
  await h.expectTextsVisible(page, [/python/i, /questions/i, /tag info|description/i]);
});
