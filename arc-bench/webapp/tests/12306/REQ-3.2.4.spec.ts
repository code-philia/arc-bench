import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.4
// fixtures: searchable_routes, search_results_dataset

test('REQ-3.2.4: Search again from the results page', async ({ page }) => {
  await h.openSearchResults(page);
  await h.fillField(page, 'Date', h.FIXTURES.searchRoute.alternateDate);
  await h.clickNamed(page, 'Search');
  await h.assertResultsPage(page);
});
