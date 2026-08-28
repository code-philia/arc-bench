import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.3.3
// fixtures: public_homepage, deletable_note

test('REQ-2.3.3: Trash list', async ({ page }) => {
  await h.openHome(page);
  await h.deleteNote(page, h.FIXTURES.notes.delete233Title);
  await h.openTrash(page);
  await h.expectNoteVisible(page, h.FIXTURES.notes.delete233Title);
});
