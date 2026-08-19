import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5.3.3
// fixtures: flight_search_home, flight_result_dataset

test('REQ-3.5.3.3: Sort by On-Time Performance', async ({ page }) => {
  await h.openFlightResults(page);
  await h.clickFirstAvailable(page, [[/准点率/, /on-time/i]]);
  await h.expectVisible(page, [/准点率/, /on-time/i]);
});
