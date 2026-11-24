// requirement: REQ-2.5
import { test, expect, action, note, section, panel, openHome, navigate, createNote, deleteNote, expectNote } from './helpers';
import { noteInput } from './fixtures/data';

test('REQ-2.5: Keep a deleted note in Trash after reload', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const title = input.name('Trash persistence');
  await createNote(page, title, input.body('Deleted content survives reload'));
  await deleteNote(page, title);
  await navigate(page, 'Trash');
  await page.reload();
  await expectNote(section(page, 'Deleted notes'), title, input.body('Deleted content survives reload'));
  await navigate(page, 'Notes');
  await expect(note(page, title)).toBeHidden();
});

test('REQ-2.5: Show deleted notes separately', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const deleted = input.name('Delete me 2.3.3');
  const active = input.name('Movie list');
  await createNote(page, deleted, input.body('Recently deleted content'));
  await createNote(page, active, input.body('Active control content'));
  await deleteNote(page, deleted);
  await navigate(page, 'Trash');
  await expectNote(section(page, 'Deleted notes'), deleted, input.body('Recently deleted content'));
  await expect(note(page, active)).toBeHidden();
});

test('REQ-2.5: Empty Trash without deleting active notes', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const deletedA = input.name('Empty trash A');
  const deletedB = input.name('Empty trash B');
  const active = input.name('Active control');
  await createNote(page, deletedA, input.body('Discard A'));
  await createNote(page, deletedB, input.body('Discard B'));
  await createNote(page, active, input.body('Keep active content'));
  await deleteNote(page, deletedA);
  await deleteNote(page, deletedB);
  await navigate(page, 'Trash');
  await expectNote(page, deletedA, input.body('Discard A'));
  await expectNote(page, deletedB, input.body('Discard B'));
  await action(page, 'Empty Trash').click();
  // Confirmation is explicitly optional; observe either public outcome.
  const confirmation = panel(page, 'Empty Trash');
  const deleted = section(page, 'Deleted notes');
  const entries = deleted.locator('article, li, tr:has(td), [role="region"], [role="group"], [role="listitem"], [role="row"]:has([role="cell"])')
    .filter({ visible: true });
  await expect.poll(async () => await confirmation.isVisible() || await entries.count() === 0).toBe(true);
  if (await confirmation.isVisible()) await action(confirmation, 'Empty Trash').click();
  await expect(deleted).toBeVisible();
  await expect(entries).toHaveCount(0);
  await page.reload();
  await expect(deleted).toBeVisible();
  await expect(entries).toHaveCount(0);
  await navigate(page, 'Notes');
  await expectNote(page, active, input.body('Keep active content'));
  await expect(note(page, deletedA)).toBeHidden();
  await expect(note(page, deletedB)).toBeHidden();
});
