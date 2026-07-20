import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.7.6.2
// fixtures: public_homepage, label_catalog, label_filtered_notes

test('REQ-2.7.6.2: View all notes', async ({ page }) => {
  await h.openHome(page);
  await h.openSidebar(page);
  await h.clickFirstAvailable(page, [[h.FIXTURES.labels.work]]);
  await h.clickFirstAvailable(page, [[/^notes$/i]]);
  await h.expectTextsVisible(page, [h.FIXTURES.notes.workFilteredTitle, h.FIXTURES.notes.otherTitle]);
});
