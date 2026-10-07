// requirement: REQ-2.2
import { test, openHome, createNote, expectNote } from './helpers';
import { identity } from './fixtures/data';

test('REQ-2.2: Autosave on closing the editor', async ({ page }, info) => {
  await openHome(page);
  await createNote(page, identity(info, 'New note'), 'First line\nSecond line');
});

test('REQ-2.2: Keep a created note after reload', async ({ page }, info) => {
  await openHome(page);
  const title = identity(info, 'Persistent note');
  await createNote(page, title, 'Saved personal content');
  await page.reload();
  await expectNote(page, title, 'Saved personal content');
});
