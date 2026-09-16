import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.6.2
// fixtures: public_homepage, colorable_note

test('REQ-2.6.2: Choose note color when created', async ({ page }) => {
  await h.openHome(page);
  await h.chooseColorDuringCreate(page);
  const dialog = page.getByRole('dialog', { name: /^Note editor$/i });
  await dialog.getByRole('textbox', { name: /^Title$/i }).fill(h.FIXTURES.notes.colorCreatedTitle);
  await dialog.getByRole('textbox', { name: /^Note content$/i }).fill(h.FIXTURES.notes.colorContent);
  await h.closeEditor(page);
  const card = await h.noteCard(page, h.FIXTURES.notes.colorCreatedTitle);
  await expect(card).toHaveCSS('background-color', 'rgb(204, 255, 144)');
});
