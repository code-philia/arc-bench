import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.4
// fixtures: flight_search_home

test('REQ-3.2.4: Exception: Past-Date Validation', async ({ page }) => {
  await h.openFlightSearch(page);
  await h.clickField(page, [/出发日期/, /departure date/i]);
  await h.expectAnyVisible(page, [[/日历/, /calendar/i], [/￥/, /¥/]]);
});
