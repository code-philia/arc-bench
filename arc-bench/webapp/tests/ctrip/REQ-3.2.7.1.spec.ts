import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.7.1
// fixtures: flight_search_home

test('REQ-3.2.7.1: Enable Return Trip', async ({ page }) => {
  await h.openFlightSearch(page);
  await h.clickFirstAvailable(page, [[/\+\s*添加返程/, /添加返程/, /add return/i]]);
  await h.expectAnyVisible(page, [[/返回日期/, /return date/i], [/往返/, /round trip/i]]);
  await h.fillField(page, [/返回日期/, /return date/i], h.FIXTURES.flightSearch.returnDate);
  await h.expectFieldValue(page, [/返回日期/, /return date/i], h.FIXTURES.flightSearch.returnDate);
});
