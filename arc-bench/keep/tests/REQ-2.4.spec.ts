// requirement: REQ-2.4
import { test, expect, action, note, notice, openHome, navigate, createNote, deleteNote, expectNote } from './helpers';
import { identity } from './fixtures/data';

test('REQ-2.4: Move a deleted note to Trash', async ({ page }, info) => {
  await openHome(page);
  const title = identity(info, 'Delete me 2.3.1');
  await createNote(page, title, 'Deletion preserves this content');
  await deleteNote(page, title);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(action(notice(page, 'Note deleted'), 'Undo')).toBeVisible();
  await expect(note(page, title)).toBeHidden();
  await navigate(page, 'Trash');
  await expectNote(page, title, 'Deletion preserves this content');
});

test('REQ-2.4: Undo deletion', async ({ page }, info) => {
  await openHome(page);
  const title = identity(info, 'Delete me 2.3.2');
  await createNote(page, title, 'Undo restores this content');
  await deleteNote(page, title);
  await action(notice(page, 'Note deleted'), 'Undo').click();
  await expect(notice(page, 'Action undone')).toBeVisible();
  await expectNote(page, title, 'Undo restores this content');
  await navigate(page, 'Trash');
  await expect(note(page, title)).toBeHidden();
});

test('REQ-2.4: Dismiss deletion notifications', async ({ page }, info) => {
  await openHome(page);
  const manual = identity(info, 'Manual dismissal');
  const automatic = identity(info, 'Automatic dismissal');
  await createNote(page, manual, 'Manual content');
  await createNote(page, automatic, 'Automatic content');
  await deleteNote(page, manual);
  await action(notice(page, 'Note deleted'), 'Dismiss notification').click();
  await expect(notice(page, 'Note deleted')).toBeHidden();
  await deleteNote(page, automatic);
  await expect(notice(page, 'Note deleted')).toBeHidden({ timeout: 60_000 });
  await expect(note(page, manual)).toBeHidden();
  await expect(note(page, automatic)).toBeHidden();
  await navigate(page, 'Trash');
  await expectNote(page, manual, 'Manual content');
  await expectNote(page, automatic, 'Automatic content');
});
