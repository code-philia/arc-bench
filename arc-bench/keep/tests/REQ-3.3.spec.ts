// requirement: REQ-3.3
import { test, expect, action, note, openHome, navigate, createNote, createLabel, labelManager, expectNote } from './helpers';
import { identity } from './fixtures/data';

test('REQ-3.3: Rename a label and retain membership', async ({ page }, info) => {
  await openHome(page);
  const original = identity(info, 'Work editable');
  const renamed = identity(info, 'Work renamed');
  const title = identity(info, 'Label rename control');
  await createLabel(page, original);
  await createNote(page, title, 'Retain label membership', { labels: [original] });
  const dialog = await labelManager(page);
  await dialog.getByRole('textbox', { name: `Label name ${original}`, exact: true }).fill(renamed);
  await action(dialog, `Save label ${original}`).click();
  await action(dialog, 'Done').click();
  await page.reload();
  const sidebar = page.getByRole('navigation', { name: 'Sidebar', exact: true });
  await expect(action(sidebar, original)).toHaveCount(0);
  await expect(action(sidebar, renamed)).toHaveCount(1);
  await expect(note(page, title).getByText(original, { exact: true })).toHaveCount(0);
  await expect(note(page, title).getByText(renamed, { exact: true })).toBeVisible();
  await navigate(page, renamed);
  await expectNote(page, title, 'Retain label membership');
});

test('REQ-3.3: Delete a label without deleting its note', async ({ page }, info) => {
  await openHome(page);
  const label = identity(info, 'Disposable label');
  const title = identity(info, 'Label delete control');
  await createLabel(page, label);
  await createNote(page, title, 'Keep this labeled note', { labels: [label] });
  const dialog = await labelManager(page);
  await action(dialog, `Delete label ${label}`).click();
  await action(dialog, 'Done').click();
  await page.reload();
  await expect(action(page.getByRole('navigation', { name: 'Sidebar', exact: true }), label)).toHaveCount(0);
  await expectNote(page, title, 'Keep this labeled note');
  await expect(note(page, title).getByText(label, { exact: true })).toHaveCount(0);
});
