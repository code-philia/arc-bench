import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.8.1
// fixtures: public_homepage, pinnable_note

test('REQ-2.8.1: Pin note', async ({ page }) => {
  await h.openHome(page);
  await h.pinNote(page, h.FIXTURES.notes.pin231Title);
  await h.expectTextsVisible(page, [/pinned/i, h.FIXTURES.notes.pin231Title]);
});
