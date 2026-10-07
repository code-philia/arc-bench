// requirement: REQ-2.8
import { test, expect, note, openHome, navigate, createNote, createLabel, assignLabels, expectNote } from './helpers';
import { identity } from './fixtures/data';

test('REQ-2.8: Assign multiple labels and filter by either', async ({ page }, info) => {
  await openHome(page);
  const work = identity(info, 'Work');
  const personal = identity(info, 'Personal');
  const title = identity(info, 'Team retro add label');
  await createLabel(page, work);
  await createLabel(page, personal);
  await createNote(page, title, 'Retro decisions');
  await assignLabels(page, title, [work, personal]);
  await page.reload();
  for (const label of [work, personal]) {
    await expect(note(page, title).getByText(label, { exact: true })).toBeVisible();
    await navigate(page, label);
    await expectNote(page, title, 'Retro decisions');
  }
});

test('REQ-2.8: Remove an assigned label', async ({ page }, info) => {
  await openHome(page);
  const work = identity(info, 'Work');
  const title = identity(info, 'Team retro remove label');
  const control = identity(info, 'Other Work note');
  await createLabel(page, work);
  await createNote(page, title, 'Remove membership', { labels: [work] });
  await createNote(page, control, 'Keep membership', { labels: [work] });
  await assignLabels(page, title, [work], false);
  await page.reload();
  await expect(note(page, title).getByText(work, { exact: true })).toHaveCount(0);
  await navigate(page, work);
  await expect(note(page, title)).toBeHidden();
  await expectNote(page, control, 'Keep membership');
});

test('REQ-2.8: Create a note with Reminders', async ({ page }, info) => {
  await openHome(page);
  const title = identity(info, 'Call dentist created');
  await createNote(page, title, 'Arrange the appointment', { labels: ['Reminders'] });
  await expect(note(page, title).getByText('Reminders', { exact: true })).toBeVisible();
  await navigate(page, 'Reminders');
  await expectNote(page, title, 'Arrange the appointment');
});
