import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.3.1
// fixtures: public_homepage, deletable_note

test('REQ-2.3.1: Delete', async ({ page }) => {
  await h.openHome(page);
  await h.deleteNote(page, h.FIXTURES.notes.delete231Title);
  await h.expectTextsVisible(page, [/^Note trashed$/i, /^Undo$/i]);
  await h.expectNoteAbsent(page, h.FIXTURES.notes.delete231Title);
});
