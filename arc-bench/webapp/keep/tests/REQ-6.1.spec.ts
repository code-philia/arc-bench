import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.1
// fixtures: public_homepage, notes_overview

test('REQ-6.1: Items and styling', async ({ page }) => {
  await h.openHome(page);
  await h.openSidebar(page);
  await h.expectTextsVisible(page, [/notes/i, /reminders/i, /edit labels/i, /archive/i, /trash/i]);
});
