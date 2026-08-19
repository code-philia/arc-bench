import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.3
// fixtures: flight_search_home

test('REQ-3.2.3: Exception: Same-City Validation', async ({ page }) => {
  await h.openFlightSearch(page);
  await h.fillField(page, [/出发城市/, /from/i], h.FIXTURES.flightSearch.sameCity);
  await h.fillField(page, [/到达城市/, /to/i], h.FIXTURES.flightSearch.sameCity);
  await h.clickFirstAvailable(page, [[/搜索/, /^search$/i]]);
  await h.expectErrorFeedback(page, [/出发城市和到达城市不能相同/, /cannot be the same/i]);
});
