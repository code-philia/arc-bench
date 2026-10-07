// requirement: REQ-2.3
import { test, expect, action, note, editor, openHome, createNote, expectNote } from './helpers';
import { identity } from './fixtures/data';

test('REQ-2.3: Save an edited note', async ({ page }, info) => {
  await openHome(page);
  const title = identity(info, 'Project ideas');
  await createNote(page, title, 'Initial editable content');
  await action(note(page, title), `Open ${title}`).click();
  await expect(editor(page).getByRole('textbox', { name: 'Title', exact: true })).toHaveValue(title);
  const content = editor(page).getByRole('textbox', { name: 'Content', exact: true });
  await expect(content).toHaveValue('Initial editable content');
  await content.fill('Updated editable content');
  await action(editor(page), 'Close').click();
  await expect(editor(page)).toBeHidden();
  await page.reload();
  await expectNote(page, title, 'Updated editable content');
  await expect(note(page, title).getByText('Initial editable content', { exact: true })).toHaveCount(0);
});
