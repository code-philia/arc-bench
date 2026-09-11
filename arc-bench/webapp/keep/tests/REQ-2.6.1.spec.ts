import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.6.1
// fixtures: public_homepage, colorable_note

test('REQ-2.6.1: Change note color', async ({ page }) => {
  await h.openHome(page);
  const before = await h.noteVisualSnapshot(page, h.FIXTURES.notes.colorExistingTitle);
  await h.changeNoteColor(page, h.FIXTURES.notes.colorExistingTitle);
  await page.keyboard.press('Escape');
  const after = await h.noteVisualSnapshot(page, h.FIXTURES.notes.colorExistingTitle);
  expect(after.equals(before)).toBe(false);
});
