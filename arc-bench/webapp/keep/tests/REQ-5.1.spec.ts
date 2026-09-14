import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.1
// fixtures: public_homepage, notes_overview

test('REQ-5.1: Toggle between list and grid views', async ({ page }) => {
  await h.openHome(page);
  await h.toggleView(page);
  await h.expectGridView(page, true);
  await h.toggleView(page);
  await h.expectGridView(page, false);
});
