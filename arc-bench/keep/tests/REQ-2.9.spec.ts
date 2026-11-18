// requirement: REQ-2.9
import { test, expect, note, section, openHome, createNote, expectNote, noteAction, expectPinAction } from './helpers';
import { noteInput } from './fixtures/data';

test('REQ-2.9: Pin an existing note', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const title = input.name('Meeting agenda 2.8.1');
  await createNote(page, title, input.body('Discuss the launch'));
  await note(page, title).hover();
  await noteAction(page, title, 'Pin').click();
  await page.reload();
  await expectNote(page, title, input.body('Discuss the launch'));
  await expect(note(section(page, 'Pinned notes'), title)).toHaveCount(1);
  await expect(note(section(page, 'Other notes'), title)).toHaveCount(0);
  await note(page, title).hover();
  await expectPinAction(page, title, true);
});

test('REQ-2.9: Unpin an existing note', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const title = input.name('Meeting agenda 2.8.2');
  await createNote(page, title, input.body('Keep meeting content'), { pinned: true });
  await note(page, title).hover();
  await noteAction(page, title, 'Unpin').click();
  await page.reload();
  await expectNote(page, title, input.body('Keep meeting content'));
  await expect(note(section(page, 'Pinned notes'), title)).toHaveCount(0);
  await expect(note(section(page, 'Other notes'), title)).toHaveCount(1);
  await note(page, title).hover();
  await expectPinAction(page, title, false);
});

test('REQ-2.9: Create a pinned note', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const title = input.name('Pinned at creation');
  await createNote(page, title, input.body('Pinned creation content'), { pinned: true });
  await page.reload();
  await expectNote(page, title, input.body('Pinned creation content'));
  await expect(note(section(page, 'Pinned notes'), title)).toHaveCount(1);
  await expect(note(section(page, 'Other notes'), title)).toHaveCount(0);
  await note(page, title).hover();
  await expectPinAction(page, title, true);
});
