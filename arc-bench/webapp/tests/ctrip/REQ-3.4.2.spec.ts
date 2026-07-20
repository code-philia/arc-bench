import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.4.2
// fixtures: flight_search_home, flight_search_history

test('REQ-3.4.2: Quickly Reuse Search History', async ({ page }) => {
  await h.openFlightSearch(page);
  await h.clickFirstAvailable(page, [[/成都\s*-\s*广州/, /成都 - 广州/, /history/i]]);
  await h.expectFlightResults(page);
});
