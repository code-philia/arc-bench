// requirement: REQ-2.9
import { test, expect, action, note, section, openHome, createNote, expectNote } from './helpers';
import { identity } from './fixtures/data';

test('REQ-2.9: Pin an existing note', async ({ page }, info) => {
  await openHome(page);
  const title = identity(info, 'Meeting agenda 2.8.1');
  await createNote(page, title, 'Discuss the launch');
  await note(page, title).hover();
  await action(note(page, title), `Pin ${title}`).click();
  await page.reload();
  await expectNote(page, title, 'Discuss the launch');
  await expect(section(page, 'Pinned notes').getByRole('region', { name: title, exact: true })).toHaveCount(1);
  await expect(section(page, 'Other notes').getByRole('region', { name: title, exact: true })).toHaveCount(0);
  await note(page, title).hover();
  await expect(action(note(page, title), `Unpin ${title}`)).toHaveAttribute('aria-pressed', 'true');
});

test('REQ-2.9: Unpin an existing note', async ({ page }, info) => {
  await openHome(page);
  const title = identity(info, 'Meeting agenda 2.8.2');
  await createNote(page, title, 'Keep meeting content', { pinned: true });
  await note(page, title).hover();
  await action(note(page, title), `Unpin ${title}`).click();
  await page.reload();
  await expectNote(page, title, 'Keep meeting content');
  await expect(section(page, 'Pinned notes').getByRole('region', { name: title, exact: true })).toHaveCount(0);
  await expect(section(page, 'Other notes').getByRole('region', { name: title, exact: true })).toHaveCount(1);
  await note(page, title).hover();
  await expect(action(note(page, title), `Pin ${title}`)).toHaveAttribute('aria-pressed', 'false');
});

test('REQ-2.9: Create a pinned note', async ({ page }, info) => {
  await openHome(page);
  const title = identity(info, 'Pinned at creation');
  await createNote(page, title, 'Pinned creation content', { pinned: true });
  await page.reload();
  await expectNote(page, title, 'Pinned creation content');
  await expect(section(page, 'Pinned notes').getByRole('region', { name: title, exact: true })).toHaveCount(1);
  await expect(section(page, 'Other notes').getByRole('region', { name: title, exact: true })).toHaveCount(0);
  await note(page, title).hover();
  await expect(action(note(page, title), `Unpin ${title}`)).toHaveAttribute('aria-pressed', 'true');
});
