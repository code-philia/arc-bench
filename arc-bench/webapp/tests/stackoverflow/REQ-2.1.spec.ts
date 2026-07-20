import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.1
// fixtures: public_homepage, homepage_questions

test('REQ-2.1: Anonymous Session', async ({ page }) => {
  await h.openHome(page);
  await h.expectTextsVisible(page, [/log in/i, /sign up/i]);
});
