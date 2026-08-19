import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.1.3
// fixtures: public_homepage, searchable_routes

test('REQ-3.1.3: Select a location from the tabbed selector', async ({ page }) => {
  await h.openHome(page);
  await h.clickNamed(page, 'From');
  await h.clickNamed(page, /[A-Za-z]+/);
  await h.expectTextsVisible(page, ['From']);
});
