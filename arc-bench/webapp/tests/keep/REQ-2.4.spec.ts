import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4
// fixtures: public_homepage, editable_note

test('REQ-2.4: Update Note', async ({ page }) => {
  await h.openHome(page);
  await h.openNote(page, h.FIXTURES.notes.editTitle);
  await h.fillField(page, [/note/i, /content/i], h.FIXTURES.notes.updatedContent);
  await h.closeEditor(page);
  await h.expectNoteVisible(page, h.FIXTURES.notes.updatedContent);
});
