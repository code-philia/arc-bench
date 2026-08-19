import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5.4.3
// fixtures: flight_search_home, flight_no_result_route

test('REQ-3.5.4.3: Exception: No Search Results', async ({ page }) => {
  await h.openFlightSearch(page);
  await h.fillField(page, [/出发城市/, /from/i], h.FIXTURES.flightSearch.noResultFrom);
  await h.fillField(page, [/到达城市/, /to/i], h.FIXTURES.flightSearch.noResultTo);
  await h.fillField(page, [/出发日期/, /departure date/i], h.FIXTURES.flightSearch.noResultDate);
  await h.clickFirstAvailable(page, [[/搜索/, /^search$/i]]);
  await h.expectAnyVisible(page, [[/未找到相关航班/, /no flights/i], [/修改搜索条件/, /modify search/i]]);
});
