import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.1
// fixtures: public_homepage, homepage_questions

test('REQ-1.1: View Homepage Layout', async ({ page }) => {
  await h.openHome(page);
  await h.expectTextsVisible(page, [/header/i, /sidebar/i, /questions/i]);
});
