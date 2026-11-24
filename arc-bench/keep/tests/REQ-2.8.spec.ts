// requirement: REQ-2.8
import { test, expect, note, openHome, navigate, createNote, createLabel, assignLabels, expectNote } from './helpers';
import { noteInput } from './fixtures/data';

test('REQ-2.8: Assign multiple labels and filter by either', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const work = input.name('Work');
  const personal = input.name('Personal');
  const title = input.name('Team retro add label');
  await createLabel(page, work);
  await createLabel(page, personal);
  await createNote(page, title, input.body('Retro decisions'));
  await assignLabels(page, title, [work, personal]);
  await page.reload();
  for (const label of [work, personal]) {
    await expect(note(page, title).getByText(label, { exact: true })).toBeVisible();
    await navigate(page, label);
    await expectNote(page, title, input.body('Retro decisions'));
  }
});

test('REQ-2.8: Remove an assigned label', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const work = input.name('Work');
  const title = input.name('Team retro remove label');
  const control = input.name('Other Work note');
  await createLabel(page, work);
  await createNote(page, title, input.body('Remove membership'), { labels: [work] });
  await createNote(page, control, input.body('Keep membership'), { labels: [work] });
  await assignLabels(page, title, [work], false);
  await page.reload();
  await expect(note(page, title).getByText(work, { exact: true })).toHaveCount(0);
  await navigate(page, work);
  await expect(note(page, title)).toBeHidden();
  await expectNote(page, control, input.body('Keep membership'));
});

test('REQ-2.8: Create a note with Reminders', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const title = input.name('Call dentist created');
  await createNote(page, title, input.body('Arrange the appointment'), { labels: ['Reminders'] });
  await expect(note(page, title).getByText('Reminders', { exact: true })).toBeVisible();
  await navigate(page, 'Reminders');
  await expectNote(page, title, input.body('Arrange the appointment'));
});
