// requirement: REQ-3.2
import { test, expect, action, note, openHome, navigate, createNote, createLabel, expectNote, sidebar as workspaceSidebar, expectCurrent } from './helpers';
import { noteInput } from './fixtures/data';

test('REQ-3.2: Filter by a user label', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const work = input.name('Work');
  const matching = input.name('Design review');
  const other = input.name('Movie list');
  await createLabel(page, work);
  await createNote(page, matching, input.body('Work design decisions'), { labels: [work] });
  await createNote(page, other, input.body('An unlabeled movie note'));
  await navigate(page, work);
  await expectNote(page, matching, input.body('Work design decisions'));
  await expect(note(page, other)).toBeHidden();
  await expectCurrent(page, work);
});

test('REQ-3.2: Return to the complete notes list', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const work = input.name('Work');
  const matching = input.name('Design review');
  const other = input.name('Movie list');
  await createLabel(page, work);
  await createNote(page, matching, input.body('Design details'), { labels: [work] });
  await createNote(page, other, input.body('Movie details'));
  await navigate(page, work);
  await expect(note(page, other)).toBeHidden();
  await navigate(page, 'Notes');
  await expectNote(page, matching, input.body('Design details'));
  await expectNote(page, other, input.body('Movie details'));
  await expectCurrent(page, 'Notes');
});

test('REQ-3.2: Filter by the default Reminders label', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const matching = input.name('Call dentist existing');
  const other = input.name('Movie list');
  await createNote(page, matching, input.body('Dentist details'), { labels: ['Reminders'] });
  await createNote(page, other, input.body('Movie details'));
  await navigate(page, 'Reminders');
  await expectNote(page, matching, input.body('Dentist details'));
  await expect(note(page, other)).toBeHidden();
  await expectCurrent(page, 'Reminders');
});
