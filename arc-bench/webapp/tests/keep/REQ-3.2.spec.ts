import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2
// fixtures: public_homepage, searchable_notes

test('REQ-3.2: Search by keyword', async ({ page }) => {
  await h.openHome(page);
  await h.search(page, h.FIXTURES.search.keyword);
  await h.expectNoteVisible(page, h.FIXTURES.search.matchingTitle);
  await h.expectTextsVisible(page, [/st/i]);
});
