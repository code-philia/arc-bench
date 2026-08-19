import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2
// fixtures: public_homepage, notes_overview

test('REQ-5.2: Grid View by default', async ({ page }) => {
  await h.openHome(page);
  await h.expectTextsVisible(page, [/list view/i, /list/i]);
});
