// requirement: REQ-2.4
import { test, expect, action, note, notice, openHome, navigate, createNote, deleteNote, expectNote } from './helpers';
import { noteInput } from './fixtures/data';

test('REQ-2.4: Move a deleted note to Trash', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const title = input.name('Delete me 2.3.1');
  await createNote(page, title, input.body('Deletion preserves this content'));
  await deleteNote(page, title);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(action(notice(page, 'Note deleted'), 'Undo')).toBeVisible();
  await expect(note(page, title)).toBeHidden();
  await navigate(page, 'Trash');
  await expectNote(page, title, input.body('Deletion preserves this content'));
});

test('REQ-2.4: Undo deletion', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const title = input.name('Delete me 2.3.2');
  await createNote(page, title, input.body('Undo restores this content'));
  await deleteNote(page, title);
  await action(notice(page, 'Note deleted'), 'Undo').click();
  await expect(notice(page, 'Action undone')).toBeVisible();
  await expectNote(page, title, input.body('Undo restores this content'));
  await navigate(page, 'Trash');
  await expect(note(page, title)).toBeHidden();
});

test('REQ-2.4: Dismiss deletion notifications', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const title = input.name('Manual dismissal');
  await createNote(page, title, input.body('Dismissal preserves deleted content'));
  await deleteNote(page, title);
  await action(notice(page, 'Note deleted'), 'Dismiss notification').click();
  await expect(notice(page, 'Note deleted')).toBeHidden();
  await expect(note(page, title)).toBeHidden();
  await navigate(page, 'Trash');
  await expectNote(page, title, input.body('Dismissal preserves deleted content'));
  await page.reload();
  await expectNote(page, title, input.body('Dismissal preserves deleted content'));
});
