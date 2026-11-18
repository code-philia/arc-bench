// requirement: REQ-4.1
import { test, expect, action, note, section, searchField, expectHighlighted, openHome, navigate, createNote, expectNote } from './helpers';
import { keywordInput, noteInput } from './fixtures/data';

test('REQ-4.1: Search title and content with highlights', async ({ page }) => {
  const { keyword, titleMatch, contentMatch, other } = keywordInput();
  await openHome(page);
  for (const record of [titleMatch, contentMatch, other]) await createNote(page, record.title, record.body);
  const search = searchField(page);
  await search.fill(keyword);
  await expectNote(page, titleMatch.title, titleMatch.body);
  await expectNote(page, contentMatch.title, contentMatch.body);
  await expect(note(page, other.title)).toBeHidden();
  await expectHighlighted(page, titleMatch.title, titleMatch.title, keyword);
  await expectHighlighted(page, contentMatch.title, contentMatch.body, keyword);
  await search.fill('');
  await navigate(page, 'Notes');
  for (const record of [titleMatch, contentMatch, other]) await expectNote(page, record.title, record.body);
});

test('REQ-4.1: Choose a suggested label filter', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const matching = input.name('assigned');
  const other = input.name('unassigned');
  await createNote(page, matching, input.body('reminder'), { labels: ['Reminders'] });
  await createNote(page, other, input.body('unlabeled'));
  const search = searchField(page);
  await search.click();
  await expect(section(page, 'Suggested filters')).toBeVisible();
  await action(section(page, 'Suggested filters'), 'Reminders').click();
  await expectNote(page, matching, input.body('reminder'));
  await expect(note(page, other)).toBeHidden();
  await search.fill('');
  await navigate(page, 'Notes');
  await expectNote(page, matching, input.body('reminder'));
  await expectNote(page, other, input.body('unlabeled'));
});
