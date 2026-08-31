import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.11
// fixtures: searchable_routes, search_results_dataset

test('REQ-3.2.11: Filter the result list by arrival station', async ({ page }) => {
  await h.openSearchResults(page);
  await h.assertFilterInteraction(page, 'To Station', 'Beijing South');
  const rows = await h.visibleDataRowTexts(page);
  expect(rows.length).toBeGreaterThan(0);
  expect(rows.every((row) => row.includes('Beijing South'))).toBeTruthy();
});
