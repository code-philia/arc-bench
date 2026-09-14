import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.1
// fixtures: public_homepage, searchable_notes

test('REQ-3.1: Initial suggested filters', async ({ page }) => {
  await h.openHome(page);
  await page.getByRole('textbox', { name: /^Search$/i }).click();
  await page.getByRole('listbox').getByRole('button', { name: /Reminders$/i }).click();
  await h.expectNoteVisible(page, h.FIXTURES.notes.reminderExistingTitle);
});
