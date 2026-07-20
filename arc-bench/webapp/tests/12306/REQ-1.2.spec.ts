import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.2
// fixtures: public_homepage

test('REQ-1.2: Show the quick guide section on the home page', async ({ page }) => {
  await h.openHome(page);
  await h.expectTextsVisible(page, ['Quick Guide']);
});
