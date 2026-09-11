import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.7.4
// fixtures: public_homepage, label_catalog

test('REQ-2.7.4: Assign default label when creating note', async ({ page }) => {
  await h.openHome(page);
  await h.openComposer(page);
  await h.clickFirstAvailable(page, [[/more/i, /options/i, /menu/i]]);
  await h.clickFirstAvailable(page, [[/change labels/i, /labels/i]]);
  await h.setLabel(page, h.FIXTURES.labels.default, true);
  await h.fillField(page, [/title/i], h.FIXTURES.notes.reminderCreatedTitle);
  await h.fillField(page, [/take a note/i, /note/i, /content/i], 'Prepare reminders note');
  await h.closeEditor(page);
  await h.expectTextsVisible(page, [h.FIXTURES.labels.default]);
});
