import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.5.4
// fixtures: public_homepage, archivable_note

test('REQ-2.5.4: Unarchive', async ({ page }) => {
  await h.openHome(page);
  await h.archiveNote(page, h.FIXTURES.notes.archive254Title);
  await h.openArchive(page);
  await h.unarchiveNote(page, h.FIXTURES.notes.archive254Title);
  await h.openSidebar(page);
  await h.clickFirstAvailable(page, [[/^notes$/i]]);
  await h.expectNoteVisible(page, h.FIXTURES.notes.archive254Title);
});
