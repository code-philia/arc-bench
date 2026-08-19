import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.4
// fixtures: public_homepage, homepage_questions

test('REQ-1.4: Main Question Feed', async ({ page }) => {
  await h.openHome(page);
  await h.expectTextsVisible(page, [/ask question/i, /newest|active/i, /votes|answers|views/i]);
});
