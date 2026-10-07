// requirement: REQ-2.7
import { test, expect, action, note, openHome, createNote, expectNote } from './helpers';
import { identity } from './fixtures/data';

test('REQ-2.7: Color an existing note', async ({ page }, info) => {
  await openHome(page);
  const title = identity(info, 'Garden tasks existing');
  await createNote(page, title, 'Water the herbs');
  await note(page, title).hover();
  await action(note(page, title), `Background color ${title}`).click();
  await action(page, 'Light green').click();
  await page.reload();
  await expectNote(page, title, 'Water the herbs');
  await note(page, title).hover();
  await expect(action(note(page, title), `Background color ${title}: Light green`)).toBeVisible();
});

test('REQ-2.7: Create a colored note', async ({ page }, info) => {
  await openHome(page);
  const title = identity(info, 'Garden tasks created');
  await createNote(page, title, 'Plant spring herbs', { green: true });
  await page.reload();
  await expectNote(page, title, 'Plant spring herbs');
  await note(page, title).hover();
  await expect(action(note(page, title), `Background color ${title}: Light green`)).toBeVisible();
});
