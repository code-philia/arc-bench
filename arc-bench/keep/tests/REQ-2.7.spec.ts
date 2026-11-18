// requirement: REQ-2.7
import { test, note, openHome, createNote, expectNote, noteAction, chooseGreen, expectGreen } from './helpers';
import { noteInput } from './fixtures/data';

test('REQ-2.7: Color an existing note', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const title = input.name('Garden tasks existing');
  await createNote(page, title, input.body('Water the herbs'));
  await note(page, title).hover();
  await noteAction(page, title, 'Background color').click();
  await chooseGreen(page);
  await page.reload();
  await expectNote(page, title, input.body('Water the herbs'));
  await expectGreen(page, title);
});

test('REQ-2.7: Create a colored note', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const title = input.name('Garden tasks created');
  await createNote(page, title, input.body('Plant spring herbs'), { green: true });
  await page.reload();
  await expectNote(page, title, input.body('Plant spring herbs'));
  await expectGreen(page, title);
});
