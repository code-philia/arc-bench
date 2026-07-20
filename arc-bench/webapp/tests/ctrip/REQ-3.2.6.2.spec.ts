import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.6.2
// fixtures: flight_search_home

test('REQ-3.2.6.2: Select a Past Date', async ({ page }) => {
  await h.openFlightSearch(page);
  await h.clickField(page, [/出发日期/, /departure date/i]);
  await h.expectAnyVisible(page, [[/日历/, /calendar/i]]);
  await h.expectAnyVisible(page, [[/今天/, /today/i, /不可选/, /disabled/i]]);
});
