import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.5.3
// fixtures: public_homepage, archivable_note

test('REQ-2.5.3: Show archived notes', async ({ page }) => {
  await h.openHome(page);
  await h.archiveNote(page, h.FIXTURES.notes.archiveTitle);
  await h.openArchive(page);
  await h.expectNoteVisible(page, h.FIXTURES.notes.archiveTitle);
});
