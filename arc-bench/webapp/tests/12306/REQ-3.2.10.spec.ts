import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.10
// fixtures: searchable_routes, search_results_dataset

test('REQ-3.2.10: Filter the result list by departure station', async ({ page }) => {
  await h.openSearchResults(page);
  await h.assertFilterInteraction(page, 'From Station', 'Shanghai Hongqiao');
});
