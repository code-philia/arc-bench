// requirement: REQ-2.2
import { test, openHome, createNote, expectNote } from './helpers';
import { noteInput } from './fixtures/data';

test('REQ-2.2: Autosave on closing the editor', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  await createNote(page, input.name('New note'), input.body('First line\nSecond line'));
});

test('REQ-2.2: Keep a created note after reload', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const title = input.name('Persistent note');
  await createNote(page, title, input.body('Saved personal content'));
  await page.reload();
  await expectNote(page, title, input.body('Saved personal content'));
});
