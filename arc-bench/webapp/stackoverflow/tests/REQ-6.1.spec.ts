import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.1
// fixtures: tags_catalog

test('REQ-6.1: View All Tags', async ({ page }) => {
  await h.openTagsPage(page);
  await h.expectTextsVisible(page, [/python/i, /javascript/i, /questions/i]);
});
