import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.1.5
// fixtures: public_homepage, searchable_routes

test('REQ-3.1.5: Search tickets from the home page', async ({ page }) => {
  await h.searchTickets(page);
  await h.assertResultsPage(page);
});
