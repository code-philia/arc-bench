import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.2
// fixtures: public_homepage, notes_overview

test('REQ-6.2: Collapsible Sidebar', async ({ page }) => {
  await h.openHome(page);
  await h.openSidebar(page);
  await h.expectTextsVisible(page, [/notes/i, /trash/i]);
  await h.toggleSidebar(page);
  await h.expectVisible(page, [/main menu/i, /menu/i, /sidebar/i]);
  await h.toggleSidebar(page);
  await h.expectTextsVisible(page, [/notes/i, /trash/i]);
});
