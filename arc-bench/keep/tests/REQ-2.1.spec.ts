// requirement: REQ-2.1
import { test, expect, note, section, openHome, createNote, expectNote } from './helpers';
import { noteInput } from './fixtures/data';

test('REQ-2.1: Separate pinned and regular notes', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const pinned = input.name('Sprint goals');
  const regular = input.name('Groceries');
  await createNote(page, pinned, input.body('Finish the sprint'), { pinned: true });
  await createNote(page, regular, input.body('Milk and bread'));
  await expect(section(page, 'Pinned notes')).toHaveCount(1);
  await expect(section(page, 'Other notes')).toHaveCount(1);
  await expect(note(section(page, 'Pinned notes'), pinned)).toHaveCount(1);
  await expect(note(section(page, 'Other notes'), regular)).toHaveCount(1);
  await expect(note(section(page, 'Other notes'), pinned)).toHaveCount(0);
  await expect(note(section(page, 'Pinned notes'), regular)).toHaveCount(0);
  await expectNote(page, pinned, input.body('Finish the sprint'));
  await expectNote(page, regular, input.body('Milk and bread'));
});
