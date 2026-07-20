import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.2
// fixtures: public_homepage

test('REQ-2.2: Create Note', async ({ page }) => {
  await h.openHome(page);
  await h.createNote(page, h.FIXTURES.notes.createTitle, h.FIXTURES.notes.createContent);
  await h.expectNoteVisible(page, h.FIXTURES.notes.createTitle);
});
