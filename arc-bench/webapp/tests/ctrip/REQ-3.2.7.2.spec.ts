import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.7.2
// fixtures: flight_search_home

test('REQ-3.2.7.2: Exception: Return Date Earlier Than Departure', async ({ page }) => {
  await h.openFlightSearch(page);
  await h.clickFirstAvailable(page, [[/\+\s*添加返程/, /添加返程/, /add return/i]]);
  await h.fillField(page, [/出发日期/, /departure date/i], h.FIXTURES.flightSearch.date);
  await h.fillField(page, [/返回日期/, /return date/i], h.FIXTURES.flightSearch.earlierReturnDate);
  await h.clickFirstAvailable(page, [[/搜索/, /^search$/i]]);
  await h.expectErrorFeedback(page, [/返程/, /return/i, /日期/, /date/i, /不能早于/, /earlier/i]);
});
