import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.8.1
// fixtures: public_homepage, pinnable_note

test('REQ-2.8.1: Pin note', async ({ page }) => {
  await h.openHome(page);
  await h.pinNote(page, h.FIXTURES.notes.pin231Title);
  await h.expectVisible(page, /^Pinned$/i);
  const card = await h.noteCard(page, h.FIXTURES.notes.pin231Title);
  await expect(card.getByTitle('Pinned')).toBeVisible();
});
