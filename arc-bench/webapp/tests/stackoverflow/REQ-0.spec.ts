import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-0
// fixtures: public_homepage, homepage_questions

test('REQ-0: Enter Platform', async ({ page }) => {
  await h.openHome(page);
  await h.expectHomepage(page);
  await h.expectTextsVisible(page, [/main question feed/i, /questions/i]);
});
