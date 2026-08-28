import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.12
// fixtures: searchable_routes, search_results_dataset

test('REQ-3.2.12: Filter the result list by departure time range', async ({ page }) => {
  await h.openSearchResults(page);
  await h.assertFilterInteraction(page, 'Departure time', '06:00-12:00');
  await expect(page.locator('.train-table tbody tr')).toHaveCount(2);
});
