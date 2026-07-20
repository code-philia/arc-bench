import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.3.2
// fixtures: public_homepage, deletable_note

test('REQ-2.3.2: Notification and Undo', async ({ page }) => {
  await h.openHome(page);
  await h.deleteNote(page, h.FIXTURES.notes.deleteTitle);
  await h.clickFirstAvailable(page, [[/^undo$/i]]);
  await h.expectTextsVisible(page, [/action undone/i, /undone/i]);
  await h.expectNoteVisible(page, h.FIXTURES.notes.deleteTitle);
});
