import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.8
// fixtures: searchable_routes, search_results_dataset

test('REQ-3.2.8: Toggle sorting by arrival time', async ({ page }) => {
  await h.openSearchResults(page);
  await h.assertSortToggle(page, 'Arrival Time');
});
