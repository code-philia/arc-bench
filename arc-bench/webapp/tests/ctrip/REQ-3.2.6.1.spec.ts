import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.6.1
// fixtures: flight_search_home

test('REQ-3.2.6.1: Select Departure Date', async ({ page }) => {
  await h.openFlightSearch(page);
  await h.clickField(page, [/出发日期/, /departure date/i]);
  await h.expectAnyVisible(page, [[/日历/, /calendar/i], [/￥/, /¥/]]);
  await h.fillField(page, [/出发日期/, /departure date/i], h.FIXTURES.flightSearch.date);
  await h.expectFieldValue(page, [/出发日期/, /departure date/i], h.FIXTURES.flightSearch.date);
});
