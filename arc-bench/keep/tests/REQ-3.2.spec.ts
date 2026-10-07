// requirement: REQ-3.2
import { test, expect, action, note, openHome, navigate, createNote, createLabel, expectNote } from './helpers';
import { identity } from './fixtures/data';

test('REQ-3.2: Filter by a user label', async ({ page }, info) => {
  await openHome(page);
  const work = identity(info, 'Work');
  const matching = identity(info, 'Design review');
  const other = identity(info, 'Movie list');
  await createLabel(page, work);
  await createNote(page, matching, 'Work design decisions', { labels: [work] });
  await createNote(page, other, 'An unlabeled movie note');
  await navigate(page, work);
  await expectNote(page, matching, 'Work design decisions');
  await expect(note(page, other)).toBeHidden();
  await expect(action(page.getByRole('navigation', { name: 'Sidebar', exact: true }), work)).toHaveAttribute('aria-current', 'true');
});

test('REQ-3.2: Return to the complete notes list', async ({ page }, info) => {
  await openHome(page);
  const work = identity(info, 'Work');
  const matching = identity(info, 'Design review');
  const other = identity(info, 'Movie list');
  await createLabel(page, work);
  await createNote(page, matching, 'Design details', { labels: [work] });
  await createNote(page, other, 'Movie details');
  await navigate(page, work);
  await expect(note(page, other)).toBeHidden();
  await navigate(page, 'Notes');
  await expectNote(page, matching, 'Design details');
  await expectNote(page, other, 'Movie details');
  await expect(action(page.getByRole('navigation', { name: 'Sidebar', exact: true }), 'Notes')).toHaveAttribute('aria-current', 'true');
});

test('REQ-3.2: Filter by the default Reminders label', async ({ page }, info) => {
  await openHome(page);
  const matching = identity(info, 'Call dentist existing');
  const other = identity(info, 'Movie list');
  await createNote(page, matching, 'Dentist details', { labels: ['Reminders'] });
  await createNote(page, other, 'Movie details');
  await navigate(page, 'Reminders');
  await expectNote(page, matching, 'Dentist details');
  await expect(note(page, other)).toBeHidden();
  await expect(action(page.getByRole('navigation', { name: 'Sidebar', exact: true }), 'Reminders')).toHaveAttribute('aria-current', 'true');
});
