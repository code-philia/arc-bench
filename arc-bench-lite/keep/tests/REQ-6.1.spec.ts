import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.1
// fixtures: public_homepage, notes_overview

test('REQ-6.1: Items and styling', async ({ page }) => {
  await h.openHome(page);
  await h.openSidebar(page);
  for (const name of ['Notes', 'Reminders', 'Edit labels', 'Archive', 'Trash']) {
    await h.expectVisible(page, new RegExp(`^${name}$`, 'i'));
  }
});
