import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.5
// fixtures: public_homepage, homepage_questions

test('REQ-1.5: Right Sidebar Widgets', async ({ page }) => {
  await h.openHome(page);
  await h.expectTextsVisible(page, [/overflow blog/i, /hot network questions/i, /featured/i]);
});
