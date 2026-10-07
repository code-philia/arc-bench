// requirement: REQ-2.1
import { test, expect, note, section, openHome, createNote } from './helpers';
import { identity } from './fixtures/data';

test('REQ-2.1: Separate pinned and regular notes', async ({ page }, info) => {
  await openHome(page);
  const pinned = identity(info, 'Sprint goals');
  const regular = identity(info, 'Groceries');
  await createNote(page, pinned, 'Finish the sprint', { pinned: true });
  await createNote(page, regular, 'Milk and bread');
  await expect(section(page, 'Pinned notes')).toHaveCount(1);
  await expect(section(page, 'Other notes')).toHaveCount(1);
  await expect(section(page, 'Pinned notes').getByRole('region', { name: pinned, exact: true })).toHaveCount(1);
  await expect(section(page, 'Other notes').getByRole('region', { name: regular, exact: true })).toHaveCount(1);
  await expect(section(page, 'Other notes').getByRole('region', { name: pinned, exact: true })).toHaveCount(0);
  await expect(section(page, 'Pinned notes').getByRole('region', { name: regular, exact: true })).toHaveCount(0);
  await expect(note(page, pinned)).toHaveCount(1);
  await expect(note(page, regular)).toHaveCount(1);
});
