import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.6.2
// fixtures: public_homepage, colorable_note

test('REQ-2.6.2: Choose note color when created', async ({ page }) => {
  await h.openHome(page);
  await h.chooseColorDuringCreate(page);
  await h.fillField(page, [/title/i], h.FIXTURES.notes.colorTitle);
  await h.fillField(page, [/take a note/i, /note/i, /content/i], h.FIXTURES.notes.colorContent);
  await h.closeEditor(page);
  await h.expectNoteVisible(page, h.FIXTURES.notes.colorTitle);
});
