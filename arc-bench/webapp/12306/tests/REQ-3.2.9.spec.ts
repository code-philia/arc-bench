import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.9
// fixtures: searchable_routes, search_results_dataset

test('REQ-3.2.9: Filter the result list by train type', async ({ page }) => {
  await h.openSearchResults(page);
  await h.assertFilterInteraction(page, 'Train type', 'G/C/D');
  await expect(page.locator('.train-table tbody')).not.toContainText('T110');
});
