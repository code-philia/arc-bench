import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.1
// fixtures: public_homepage, notes_overview

test('REQ-5.1: Toggle between list and grid views', async ({ page }) => {
  await h.openHome(page);
  await h.toggleView(page);
  await h.expectTextsVisible(page, [/grid view/i, /grid/i]);
  await h.toggleView(page);
  await h.expectTextsVisible(page, [/list view/i, /list/i]);
});
