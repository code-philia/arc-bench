// requirement: REQ-2.5
import { test, expect, action, note, section, openHome, navigate, createNote, deleteNote, expectNote } from './helpers';
import { identity } from './fixtures/data';

test('REQ-2.5: Keep a deleted note in Trash after reload', async ({ page }, info) => {
  await openHome(page);
  const title = identity(info, 'Trash persistence');
  await createNote(page, title, 'Deleted content survives reload');
  await deleteNote(page, title);
  await navigate(page, 'Trash');
  await page.reload();
  await expect(section(page, 'Deleted notes')).toBeVisible();
  await expectNote(page, title, 'Deleted content survives reload');
  await navigate(page, 'Notes');
  await expect(note(page, title)).toBeHidden();
});

test('REQ-2.5: Show deleted notes separately', async ({ page }, info) => {
  await openHome(page);
  const deleted = identity(info, 'Delete me 2.3.3');
  const active = identity(info, 'Movie list');
  await createNote(page, deleted, 'Recently deleted content');
  await createNote(page, active, 'Active control content');
  await deleteNote(page, deleted);
  await navigate(page, 'Trash');
  await expect(section(page, 'Deleted notes')).toBeVisible();
  await expectNote(page, deleted, 'Recently deleted content');
  await expect(note(page, active)).toBeHidden();
});

test('REQ-2.5: Empty Trash without deleting active notes', async ({ page }, info) => {
  await openHome(page);
  const deletedA = identity(info, 'Empty trash A');
  const deletedB = identity(info, 'Empty trash B');
  const active = identity(info, 'Active control');
  await createNote(page, deletedA, 'Discard A');
  await createNote(page, deletedB, 'Discard B');
  await createNote(page, active, 'Keep active content');
  await deleteNote(page, deletedA);
  await deleteNote(page, deletedB);
  await navigate(page, 'Trash');
  await expectNote(page, deletedA, 'Discard A');
  await expectNote(page, deletedB, 'Discard B');
  await action(page, 'Empty Trash').click();
  // Confirmation is explicitly optional; observe either public outcome.
  const confirmation = page.getByRole('dialog', { name: 'Empty Trash', exact: true });
  await expect(confirmation.or(section(page, 'Deleted notes').filter({ hasNot: page.getByRole('region', { name: deletedA, exact: true }) }))).toBeVisible();
  if (await confirmation.isVisible()) await action(confirmation, 'Empty Trash').click();
  await expect(section(page, 'Deleted notes').getByRole('region')).toHaveCount(0);
  await page.reload();
  await expect(section(page, 'Deleted notes').getByRole('region')).toHaveCount(0);
  await navigate(page, 'Notes');
  await expectNote(page, active, 'Keep active content');
  await expect(note(page, deletedA)).toBeHidden();
  await expect(note(page, deletedB)).toBeHidden();
});
