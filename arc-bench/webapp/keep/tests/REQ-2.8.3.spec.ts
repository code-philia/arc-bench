import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.8.3
// fixtures: public_homepage, pinnable_note

test('REQ-2.8.3: Pin note when creating it', async ({ page }) => {
  await h.openHome(page);
  await h.openComposer(page);
  await h.fillField(page, [/title/i], h.FIXTURES.notes.pinTitle);
  await h.fillField(page, [/take a note/i, /note/i, /content/i], h.FIXTURES.notes.pinContent);
  await h.clickFirstAvailable(page, [[/pin/i]]);
  await h.closeEditor(page);
  await h.expectTextsVisible(page, [/pinned/i, h.FIXTURES.notes.pinTitle]);
});
