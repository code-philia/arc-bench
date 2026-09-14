import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.8.3
// fixtures: public_homepage, pinnable_note

test('REQ-2.8.3: Pin note when creating it', async ({ page }) => {
  await h.openHome(page);
  await h.openComposer(page);
  const dialog = page.getByRole('dialog', { name: /^Note editor$/i });
  await dialog.getByRole('textbox', { name: /^Title$/i }).fill(h.FIXTURES.notes.pinCreatedTitle);
  await dialog.getByRole('textbox', { name: /^Note content$/i }).fill(h.FIXTURES.notes.pinContent);
  await dialog.getByRole('button', { name: /^Pin note$/i }).click();
  await h.closeEditor(page);
  const card = await h.noteCard(page, h.FIXTURES.notes.pinCreatedTitle);
  await expect(card.getByTitle('Pinned')).toBeVisible();
});
