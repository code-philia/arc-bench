import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5.2.3
// fixtures: flight_search_home, flight_result_dataset

test('REQ-3.5.2.3: Switch to Next Week', async ({ page }) => {
  await h.openFlightResults(page);
  await h.clickFirstAvailable(page, [[/下周/, /next week/i]]);
  await h.expectFlightResults(page);
});
