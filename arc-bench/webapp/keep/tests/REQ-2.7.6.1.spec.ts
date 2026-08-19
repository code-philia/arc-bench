import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.7.6.1
// fixtures: public_homepage, label_catalog, label_filtered_notes

test('REQ-2.7.6.1: View list filtered by label', async ({ page }) => {
  await h.openHome(page);
  await h.openSidebar(page);
  await h.clickFirstAvailable(page, [[h.FIXTURES.labels.work]]);
  await h.expectNoteVisible(page, h.FIXTURES.notes.workFilteredTitle);
  await h.expectTextAbsent(page, h.FIXTURES.notes.otherTitle);
});
