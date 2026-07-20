import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.1
// fixtures: public_homepage, searchable_notes

test('REQ-3.1: Initial suggested filters', async ({ page }) => {
  await h.openHome(page);
  await h.clickFirstAvailable(page, [[/search/i]]);
  await h.clickFirstAvailable(page, [[h.FIXTURES.labels.default]]);
  await h.expectNoteVisible(page, h.FIXTURES.notes.reminderTitle);
});
