import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.8.2
// fixtures: public_homepage, pinnable_note

test('REQ-2.8.2: Unpin note', async ({ page }) => {
  await h.openHome(page);
  await h.pinNote(page, h.FIXTURES.notes.pin232Title);
  await h.unpinNote(page, h.FIXTURES.notes.pin232Title);
  const card = await h.noteCard(page, h.FIXTURES.notes.pin232Title);
  await expect(card).toBeVisible();
  await expect(card.getByTitle('Pinned')).toHaveCount(0);
});
