import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.5.2
// fixtures: public_homepage, archivable_note

test('REQ-2.5.2: Archive Undo', async ({ page }) => {
  await h.openHome(page);
  await h.archiveNote(page, h.FIXTURES.notes.archiveTitle);
  await h.clickFirstAvailable(page, [[/^undo$/i]]);
  await h.expectNoteVisible(page, h.FIXTURES.notes.archiveTitle);
});
