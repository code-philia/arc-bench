import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.3
// fixtures: public_homepage, homepage_questions

test('REQ-1.3: Sidebar Navigation', async ({ page }) => {
  await h.openHome(page);
  await h.clickFirstAvailable(page, [[/^questions$/i]]);
  await h.expectTextsVisible(page, [/questions/i]);
});
