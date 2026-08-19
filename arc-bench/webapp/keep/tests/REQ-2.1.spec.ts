import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.1
// fixtures: public_homepage, notes_overview

test('REQ-2.1: Note Listing', async ({ page }) => {
  await h.openHome(page);
  await h.expectTextsVisible(page, [h.FIXTURES.notes.pinnedTitle, h.FIXTURES.notes.regularTitle]);
  await h.expectTextsVisible(page, [/pinned/i, /others|notes/i]);
});
