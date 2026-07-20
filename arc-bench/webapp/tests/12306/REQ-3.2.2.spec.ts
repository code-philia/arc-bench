import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.2
// fixtures: searchable_routes, search_results_dataset

test('REQ-3.2.2: Show ticket prices and booking actions in each result row', async ({ page }) => {
  await h.openSearchResults(page);
  await h.expectTextsVisible(page, ['Book', 'Price']);
});
