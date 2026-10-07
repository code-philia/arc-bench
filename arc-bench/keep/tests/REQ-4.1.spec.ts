// requirement: REQ-4.1
import { test, expect, action, note, section, openHome, navigate, createNote, expectNote } from './helpers';
import { identity } from './fixtures/data';

test('REQ-4.1: Search title and content with highlights', async ({ page }, info) => {
  await openHome(page);
  const titleMatch = identity(info, 'Study schedule');
  const contentMatch = identity(info, 'Reading plan');
  const other = identity(info, 'Ocean memo');
  await createNote(page, titleMatch, 'Math on Monday');
  await createNote(page, contentMatch, 'Read a story');
  await createNote(page, other, 'Calm blue waves');
  const search = page.getByRole('searchbox', { name: 'Search', exact: true });
  await search.fill('st');
  await expect(note(page, titleMatch)).toHaveCount(1);
  await expect(note(page, contentMatch)).toHaveCount(1);
  await expect(note(page, other)).toBeHidden();
  // Named highlight regions provide the portable semantic highlight contract.
  for (const title of [titleMatch, contentMatch]) {
    const fragment = note(page, title).getByRole('region', { name: 'Highlight st', exact: true });
    await expect(fragment).toBeVisible();
    await expect(fragment).toHaveText(/^st$/i);
  }
  await search.fill('');
  await navigate(page, 'Notes');
  await expectNote(page, titleMatch, 'Math on Monday');
  await expectNote(page, contentMatch, 'Read a story');
  await expectNote(page, other, 'Calm blue waves');
});

test('REQ-4.1: Choose a suggested label filter', async ({ page }, info) => {
  await openHome(page);
  const matching = identity(info, 'Call dentist existing');
  const other = identity(info, 'Movie list');
  await createNote(page, matching, 'Reminder content', { labels: ['Reminders'] });
  await createNote(page, other, 'Unlabeled content');
  const search = page.getByRole('searchbox', { name: 'Search', exact: true });
  await search.click();
  await expect(section(page, 'Suggested filters')).toBeVisible();
  await action(section(page, 'Suggested filters'), 'Reminders').click();
  await expectNote(page, matching, 'Reminder content');
  await expect(note(page, other)).toBeHidden();
  await search.fill('');
  await navigate(page, 'Notes');
  await expectNote(page, matching, 'Reminder content');
  await expectNote(page, other, 'Unlabeled content');
});
