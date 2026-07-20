import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.13
// fixtures: searchable_routes, search_results_dataset

test('REQ-3.2.13: Enter the results page from the home quick search module', async ({ page }) => {
  await h.searchTickets(page);
  await h.assertResultsPage(page);
});
