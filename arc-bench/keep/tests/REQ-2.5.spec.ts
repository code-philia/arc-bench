// requirement: REQ-2.5
import { test, expect, action, note, section, openHome, navigate, createNote, deleteNote, expectNote } from './helpers';
import { history, identity } from './fixtures/data';

test('REQ-2.5: Apply the seven-day retention boundary', async ({ page }) => {
  // Evaluator initializes historical deletions and fixes server time before startup.
  const historicalURL = process.env.KEEP_HISTORY_BASE_URL;
  if (!historicalURL) throw new Error('KEEP_HISTORY_BASE_URL must point to a separately initialized historical instance');
  const normalURL = process.env.KEEP_BASE_URL || process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:34004/';
  if (new URL(historicalURL).origin === new URL(normalURL).origin) throw new Error('Historical and normal instances must have different origins');
  await page.goto(historicalURL);
  await navigate(page, 'Trash');
  await page.reload();
  await expect(section(page, 'Deleted notes')).toBeVisible();
  await expect(note(page, history.expired.title)).toHaveCount(0);
  await expectNote(page, history.recent.title, history.recent.content);
  await navigate(page, 'Notes');
  await expect(note(page, history.expired.title)).toHaveCount(0);
  await expect(note(page, history.recent.title)).toHaveCount(0);
});

test('REQ-2.5: Show deleted notes separately', async ({ page }, info) => {
  await openHome(page);
  const deleted = identity(info, 'Delete me 2.3.3');
  const active = identity(info, 'Movie list');
  await createNote(page, deleted, 'Recently deleted content');
  await createNote(page, active, 'Active control content');
  await deleteNote(page, deleted);
  await navigate(page, 'Trash');
  await expect(section(page, 'Deleted notes')).toBeVisible();
  await expectNote(page, deleted, 'Recently deleted content');
  await expect(note(page, active)).toBeHidden();
});

test('REQ-2.5: Empty Trash without deleting active notes', async ({ page }, info) => {
  await openHome(page);
  const deletedA = identity(info, 'Empty trash A');
  const deletedB = identity(info, 'Empty trash B');
  const active = identity(info, 'Active control');
  await createNote(page, deletedA, 'Discard A');
  await createNote(page, deletedB, 'Discard B');
  await createNote(page, active, 'Keep active content');
  await deleteNote(page, deletedA);
  await deleteNote(page, deletedB);
  await navigate(page, 'Trash');
  await expectNote(page, deletedA, 'Discard A');
  await expectNote(page, deletedB, 'Discard B');
  await action(page, 'Empty Trash').click();
  // Confirmation is explicitly optional; observe either public outcome.
  const confirmation = page.getByRole('dialog', { name: 'Empty Trash', exact: true });
  await expect(confirmation.or(section(page, 'Deleted notes').filter({ hasNot: page.getByRole('region', { name: deletedA, exact: true }) }))).toBeVisible();
  if (await confirmation.isVisible()) await action(confirmation, 'Empty Trash').click();
  await expect(section(page, 'Deleted notes').getByRole('region')).toHaveCount(0);
  await page.reload();
  await expect(section(page, 'Deleted notes').getByRole('region')).toHaveCount(0);
  await navigate(page, 'Notes');
  await expectNote(page, active, 'Keep active content');
  await expect(note(page, deletedA)).toBeHidden();
  await expect(note(page, deletedB)).toBeHidden();
});
