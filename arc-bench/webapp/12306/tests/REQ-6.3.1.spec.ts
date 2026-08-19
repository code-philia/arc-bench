import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.3.1
// fixtures: travel_guide_content

test('REQ-6.3.1: Open one common question from the home page quick guide section', async ({ page }) => {
  await h.openHome(page);
  await h.clickNamed(page, /How to book tickets online\?/i);
  await h.expectTextsVisible(page, ['Ticketing']);
});
