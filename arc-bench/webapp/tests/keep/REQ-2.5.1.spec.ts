import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.5.1
// fixtures: public_homepage, archivable_note

test('REQ-2.5.1: Archive', async ({ page }) => {
  await h.openHome(page);
  await h.archiveNote(page, h.FIXTURES.notes.archiveTitle);
  await h.expectTextsVisible(page, [/archived/i, /undo/i]);
});
