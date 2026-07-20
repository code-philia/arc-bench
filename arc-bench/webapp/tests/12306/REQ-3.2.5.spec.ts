import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.5
// fixtures: searchable_routes, search_results_dataset

test('REQ-3.2.5: Search with another date from the date-switching bar', async ({ page }) => {
  await h.openSearchResults(page);
  await h.clickNamed(page, /Sun|Mon|Tue|Wed|Thu|Fri|Sat/i);
  await h.assertResultsPage(page);
});
