import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.1.1
// fixtures: public_homepage, searchable_routes

test('REQ-3.1.1: Display the quick search module on the home page', async ({ page }) => {
  await h.openHome(page);
  await h.expectQuickSearch(page);
});
