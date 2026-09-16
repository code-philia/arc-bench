import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.6.1
// fixtures: public_homepage, colorable_note

test('REQ-2.6.1: Change note color', async ({ page }) => {
  await h.openHome(page);
  await h.changeNoteColor(page, h.FIXTURES.notes.colorExistingTitle);
  const card = await h.noteCard(page, h.FIXTURES.notes.colorExistingTitle);
  await expect(card).toHaveCSS('background-color', 'rgb(204, 255, 144)');
});
