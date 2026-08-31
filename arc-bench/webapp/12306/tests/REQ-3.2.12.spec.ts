import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.12
// fixtures: searchable_routes, search_results_dataset

test('REQ-3.2.12: Filter the result list by departure time range', async ({ page }) => {
  await h.openSearchResults(page);
  await h.assertFilterInteraction(page, 'Departure time', '06:00-12:00');
  const rows = await h.visibleDataRowTexts(page);
  expect(rows.length).toBeGreaterThan(0);
  expect(rows.every((row) => /\b(?:0[6-9]|1[01]):\d{2}\b/.test(row))).toBeTruthy();
});
