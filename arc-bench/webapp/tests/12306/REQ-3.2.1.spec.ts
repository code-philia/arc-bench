import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.1
// fixtures: searchable_routes, search_results_dataset

test('REQ-3.2.1: Display the populated ticket search results page', async ({ page }) => {
  await h.openSearchResults(page);
  await h.assertResultsPage(page);
});
