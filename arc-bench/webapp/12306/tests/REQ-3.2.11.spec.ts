import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.11
// fixtures: searchable_routes, search_results_dataset

test('REQ-3.2.11: Filter the result list by arrival station', async ({ page }) => {
  await h.openSearchResults(page);
  await h.assertFilterInteraction(page, 'To Station', 'Beijing South');
  await expect(page.locator('.train-table tbody tr')).toHaveCount(2);
});
