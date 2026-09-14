import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.7.4
// fixtures: public_homepage, label_catalog

test('REQ-2.7.4: Assign default label when creating note', async ({ page }) => {
  await h.openHome(page);
  await h.openComposer(page);
  const dialog = page.getByRole('dialog', { name: /^Note editor$/i });
  await dialog.getByRole('button', { name: /^More options$/i }).click();
  await dialog.getByRole('button', { name: /^Change labels$/i }).click();
  await h.setLabel(page, h.FIXTURES.labels.default, true);
  await dialog.getByRole('textbox', { name: /^Title$/i }).fill(h.FIXTURES.notes.reminderCreatedTitle);
  await dialog.getByRole('textbox', { name: /^Note content$/i }).fill('Prepare reminders note');
  await h.closeEditor(page);
  const card = await h.noteCard(page, h.FIXTURES.notes.reminderCreatedTitle);
  await expect(card).toContainText(h.FIXTURES.labels.default);
});
