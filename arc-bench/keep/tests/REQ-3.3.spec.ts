// requirement: REQ-3.3
import { test, expect, action, note, openHome, navigate, createNote, createLabel, labelManager, labelField, labelCommand, expectNote, sidebar as workspaceSidebar } from './helpers';
import { noteInput } from './fixtures/data';

test('REQ-3.3: Rename a label and retain membership', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const original = input.name('Work editable');
  const renamed = input.name('Work renamed');
  const title = input.name('Label rename control');
  await createLabel(page, original);
  await createNote(page, title, input.body('Retain label membership'), { labels: [original] });
  const dialog = await labelManager(page);
  await (await labelField(dialog, original)).fill(renamed);
  await (await labelCommand(dialog, 'Save label', original, renamed)).click();
  await action(dialog, 'Done').click();
  await page.reload();
  const sidebar = workspaceSidebar(page);
  await expect(action(sidebar, original)).toHaveCount(0);
  await expect(action(sidebar, renamed)).toHaveCount(1);
  await expect(note(page, title).getByText(original, { exact: true })).toHaveCount(0);
  await expect(note(page, title).getByText(renamed, { exact: true })).toBeVisible();
  await navigate(page, renamed);
  await expectNote(page, title, input.body('Retain label membership'));
});

test('REQ-3.3: Delete a label without deleting its note', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const label = input.name('Disposable label');
  const title = input.name('Label delete control');
  await createLabel(page, label);
  await createNote(page, title, input.body('Keep this labeled note'), { labels: [label] });
  const dialog = await labelManager(page);
  await (await labelCommand(dialog, 'Delete label', label)).click();
  await action(dialog, 'Done').click();
  await page.reload();
  await expect(action(workspaceSidebar(page), label)).toHaveCount(0);
  await expectNote(page, title, input.body('Keep this labeled note'));
  await expect(note(page, title).getByText(label, { exact: true })).toHaveCount(0);
});
