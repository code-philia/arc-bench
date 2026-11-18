// requirement: REQ-2.3
import { test, expect, note, editor, field, noteContent, expectFieldValue, openHome, createNote, openNote, closeEditor, expectNote } from './helpers';
import { noteInput } from './fixtures/data';

test('REQ-2.3: Save an edited note', async ({ page }) => {
  const input = noteInput();
  const title = input.name('editable note');
  const original = input.body('before');
  const replacement = input.body('after');
  await openHome(page);
  await createNote(page, title, original);
  await openNote(page, title);
  await expectFieldValue(field(editor(page), 'Title'), title);
  await expectFieldValue(noteContent(page), original);
  await noteContent(page).fill(replacement);
  await closeEditor(page);
  await page.reload();
  await expectNote(page, title, replacement);
  await expect(note(page, title).getByText(original, { exact: true }).filter({ visible: true })).toHaveCount(0);
});
