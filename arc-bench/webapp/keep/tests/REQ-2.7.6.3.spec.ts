import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.7.6.3
// fixtures: public_homepage, label_catalog, label_filtered_notes

test('REQ-2.7.6.3: View Reminders', async ({ page }) => {
  await h.openHome(page);
  await h.openSidebar(page);
  await h.clickFirstAvailable(page, [[h.FIXTURES.labels.default]]);
  await h.expectNoteVisible(page, h.FIXTURES.notes.reminderTitle);
  await h.expectTextAbsent(page, h.FIXTURES.notes.otherTitle);
});
