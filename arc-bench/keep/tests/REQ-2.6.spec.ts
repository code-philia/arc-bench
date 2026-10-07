// requirement: REQ-2.6
import { test, expect, action, note, notice, section, openHome, navigate, createNote, archiveNote, expectNote } from './helpers';
import { identity } from './fixtures/data';

test('REQ-2.6: Archive a note into its separate list', async ({ page }, info) => {
  await openHome(page);
  const title = identity(info, 'Travel plans 2.5.1');
  const active = identity(info, 'Active archive control');
  await createNote(page, title, 'Trip itinerary');
  await createNote(page, active, 'Stay active');
  await archiveNote(page, title);
  await expect(action(notice(page, 'Note archived'), 'Undo')).toBeVisible();
  await navigate(page, 'Archived');
  await expect(section(page, 'Archived notes')).toBeVisible();
  await expectNote(page, title, 'Trip itinerary');
  await expect(note(page, active)).toBeHidden();
  await navigate(page, 'Notes');
  await page.reload();
  await expect(note(page, title)).toBeHidden();
  await expectNote(page, active, 'Stay active');
});

test('REQ-2.6: Undo archiving', async ({ page }, info) => {
  await openHome(page);
  const title = identity(info, 'Travel plans 2.5.2');
  await createNote(page, title, 'Return this itinerary');
  await archiveNote(page, title);
  await action(notice(page, 'Note archived'), 'Undo').click();
  await expect(notice(page, 'Action undone')).toBeVisible();
  await expectNote(page, title, 'Return this itinerary');
  await navigate(page, 'Archived');
  await expect(note(page, title)).toBeHidden();
});

test('REQ-2.6: Unarchive the selected note', async ({ page }, info) => {
  await openHome(page);
  const title = identity(info, 'Travel plans 2.5.4');
  const other = identity(info, 'Other archived note');
  await createNote(page, title, 'Selected itinerary');
  await createNote(page, other, 'Other itinerary');
  await archiveNote(page, title);
  await archiveNote(page, other);
  await navigate(page, 'Archived');
  await expectNote(page, title, 'Selected itinerary');
  await expectNote(page, other, 'Other itinerary');
  await note(page, title).hover();
  await action(note(page, title), `Unarchive ${title}`).click();
  await expect(note(page, title)).toBeHidden();
  await expectNote(page, other, 'Other itinerary');
  await navigate(page, 'Notes');
  await page.reload();
  await expectNote(page, title, 'Selected itinerary');
  await expect(note(page, other)).toBeHidden();
});
