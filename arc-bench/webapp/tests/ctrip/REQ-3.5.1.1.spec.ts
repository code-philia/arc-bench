import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5.1.1
// fixtures: flight_search_home, flight_result_dataset

test('REQ-3.5.1.1: Modify Search Criteria', async ({ page }) => {
  await h.openFlightResults(page);
  await h.fillField(page, [/出发日期/, /departure date/i], h.FIXTURES.flightSearch.nearbyDate);
  await h.chooseOption(page, [/舱等/, /cabin/i], [/经济舱/, /economy/i]);
  await h.clickFirstAvailable(page, [[/搜索/, /^search$/i, /refresh/i]]);
  await h.expectFlightResults(page);
});
