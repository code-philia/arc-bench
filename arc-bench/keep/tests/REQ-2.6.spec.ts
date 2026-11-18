// requirement: REQ-2.6
import { test, expect, action, note, notice, section, openHome, navigate, createNote, archiveNote, expectNote, noteAction } from './helpers';
import { noteInput } from './fixtures/data';

test('REQ-2.6: Archive a note into its separate list', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const title = input.name('Travel plans 2.5.1');
  const active = input.name('Active archive control');
  await createNote(page, title, input.body('Trip itinerary'));
  await createNote(page, active, input.body('Stay active'));
  await archiveNote(page, title);
  await expect(action(notice(page, 'Note archived'), 'Undo')).toBeVisible();
  await navigate(page, 'Archived');
  await expect(section(page, 'Archived notes')).toBeVisible();
  await expectNote(page, title, input.body('Trip itinerary'));
  await expect(note(page, active)).toBeHidden();
  await navigate(page, 'Notes');
  await page.reload();
  await expect(note(page, title)).toBeHidden();
  await expectNote(page, active, input.body('Stay active'));
});

test('REQ-2.6: Undo archiving', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const title = input.name('Travel plans 2.5.2');
  await createNote(page, title, input.body('Return this itinerary'));
  await archiveNote(page, title);
  await action(notice(page, 'Note archived'), 'Undo').click();
  await expect(notice(page, 'Action undone')).toBeVisible();
  await expectNote(page, title, input.body('Return this itinerary'));
  await navigate(page, 'Archived');
  await expect(note(page, title)).toBeHidden();
});

test('REQ-2.6: Unarchive the selected note', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const title = input.name('Travel plans 2.5.4');
  const other = input.name('Other archived note');
  await createNote(page, title, input.body('Selected itinerary'));
  await createNote(page, other, input.body('Other itinerary'));
  await archiveNote(page, title);
  await archiveNote(page, other);
  await navigate(page, 'Archived');
  await expectNote(page, title, input.body('Selected itinerary'));
  await expectNote(page, other, input.body('Other itinerary'));
  await note(page, title).hover();
  await noteAction(page, title, 'Unarchive').click();
  await expect(note(page, title)).toBeHidden();
  await expectNote(page, other, input.body('Other itinerary'));
  await navigate(page, 'Notes');
  await page.reload();
  await expectNote(page, title, input.body('Selected itinerary'));
  await expect(note(page, other)).toBeHidden();
});
